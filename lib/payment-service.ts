import { supabase } from "./supabase";

// Lightweight cache and in-flight dedupe to avoid duplicate requests
let cachedPaymentInfo: { userId: string | null; data: UserPaymentInfo | null; ts: number } = {
  userId: null,
  data: null,
  ts: 0,
};
let inflightPaymentInfo: Promise<UserPaymentInfo | null> | null = null;

export interface UserPaymentInfo {
  user_tier: string;
  payment_provider: string | null;
  payment_amount: number | null;
  payment_currency: string | null;
  payment_status: string;
  payment_date: string | null;
  expiry_date: string | null;
  expiry_type: string;
  is_paid_user: boolean;
  can_make_payment: boolean;
}

export interface PaymentStatusResult {
  isPaid: boolean;
  tier: string;
  provider: string | null;
  amount: number | null;
  currency: string | null;
  paymentDate: string | null;
  expiryDate: string | null;
  canMakePayment: boolean;
}

export class PaymentService {
  /**
   * Get the current user's payment information by querying the profiles table directly
   */
  static async getUserPaymentInfo(forceRefresh = false): Promise<UserPaymentInfo | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Return cached result if within 2s and user unchanged and not forced
      const now = Date.now();
      if (
        !forceRefresh &&
        cachedPaymentInfo.userId === user.id &&
        now - cachedPaymentInfo.ts < 2000 &&
        cachedPaymentInfo.data !== null
      ) {
        return cachedPaymentInfo.data;
      }

      // If a request is in-flight and not forced, return the same promise
      if (!forceRefresh && inflightPaymentInfo) {
        return inflightPaymentInfo;
      }

      // First, try to get the payment info with all columns
      const doFetch = async (): Promise<UserPaymentInfo | null> => {
        let query = supabase
        .from("profiles")
        .select(
          "user_tier, payment_provider, payment_amount, payment_currency, payment_status, payment_date, expiry_date, expiry_type, is_paid_user"
        )
        .eq("id", user.id)
        .single();
        let { data, error } = await query;

        // If we get an error about missing columns, try a simpler query
        if (
          error &&
          error.message.includes("column") &&
          error.message.includes("does not exist")
        ) {
          // Try to get basic profile info without payment columns
          const { data: basicData, error: basicError } = await supabase
            .from("profiles")
            .select("id")
            .eq("id", user.id)
            .single();

          if (basicError) {
            console.error("Error fetching user profile:", basicError);
            throw basicError;
          }

          // Return default payment info if payment columns don't exist yet
          if (basicData) {
            return {
              user_tier: "free",
              payment_provider: null,
              payment_amount: null,
              payment_currency: "usd",
              payment_status: "none",
              payment_date: null,
              expiry_date: null,
              expiry_type: "never",
              is_paid_user: false,
              can_make_payment: true,
            };
          }

          return null;
        }

        if (error) {
          console.error("Error fetching user payment info:", error);
          throw error;
        }

        if (!data) {
          return null;
        }

        // Calculate can_make_payment based on the logic from the database function
        let canMakePayment = true;
        if (
          data.payment_status &&
          !["none", "failed", "refunded", "canceled"].includes(
            data.payment_status
          )
        ) {
          if (
            data.expiry_date === null ||
            new Date(data.expiry_date) > new Date()
          ) {
            canMakePayment = false;
          }
        }

        return {
          ...data,
          can_make_payment: canMakePayment,
        };
      };

      inflightPaymentInfo = doFetch();
      const result = await inflightPaymentInfo;
      cachedPaymentInfo = { userId: user.id, data: result, ts: Date.now() };
      inflightPaymentInfo = null;
      return result;
    } catch (error) {
      console.error("Error in getUserPaymentInfo:", error);
      // Return default payment info if there's an error
      return {
        user_tier: "free",
        payment_provider: null,
        payment_amount: null,
        payment_currency: "usd",
        payment_status: "none",
        payment_date: null,
        expiry_date: null,
        expiry_type: "never",
        is_paid_user: false,
        can_make_payment: true,
      };
    }
  }

  /**
   * Check if the current user can make a payment
   */
  static async canUserMakePayment(): Promise<boolean> {
    try {
      const paymentInfo = await this.getUserPaymentInfo();

      if (!paymentInfo) {
        return true; // New users can make payments
      }

      return paymentInfo.can_make_payment;
    } catch (error) {
      console.error("Error checking if user can make payment:", error);
      return true; // Allow payment by default if there's an error
    }
  }

  /**
   * Check if the current user is a paid user
   */
  static async isPaidUser(): Promise<boolean> {
    try {
      const paymentInfo = await this.getUserPaymentInfo();

      if (!paymentInfo) {
        return false;
      }

      // Check if user has active payment and hasn't expired
      if (
        paymentInfo.is_paid_user &&
        paymentInfo.payment_status === "completed"
      ) {
        // If no expiry date, it's a lifetime payment
        if (!paymentInfo.expiry_date) {
          return true;
        }

        // Check if payment hasn't expired
        const expiryDate = new Date(paymentInfo.expiry_date);
        const now = new Date();
        return expiryDate > now;
      }

      return false;
    } catch (error) {
      console.error("Error checking if user is paid:", error);
      return false;
    }
  }

  /**
   * Get user tier information
   */
  static async getUserTier(): Promise<string> {
    try {
      const paymentInfo = await this.getUserPaymentInfo();
      return paymentInfo?.user_tier || "free";
    } catch (error) {
      console.error("Error getting user tier:", error);
      return "free";
    }
  }

  /**
   * Get payment status for display
   */
  static async getPaymentStatus(): Promise<PaymentStatusResult> {
    try {
      const paymentInfo = await this.getUserPaymentInfo();

      if (!paymentInfo) {
        return {
          isPaid: false,
          tier: "free",
          provider: null,
          amount: null,
          currency: null,
          paymentDate: null,
          expiryDate: null,
          canMakePayment: true,
        };
      }

      // Derive isPaid from the same fetched record to avoid an extra query
      let isPaid = false;
      if (
        paymentInfo.is_paid_user &&
        paymentInfo.payment_status === "completed"
      ) {
        // Lifetime or not expired
        if (!paymentInfo.expiry_date) {
          isPaid = true;
        } else {
          isPaid = new Date(paymentInfo.expiry_date) > new Date();
        }
      }

      return {
        isPaid,
        tier: paymentInfo.user_tier,
        provider: paymentInfo.payment_provider,
        amount: paymentInfo.payment_amount,
        currency: paymentInfo.payment_currency,
        paymentDate: paymentInfo.payment_date,
        expiryDate: paymentInfo.expiry_date,
        canMakePayment: paymentInfo.can_make_payment,
      };
    } catch (error) {
      console.error("Error getting payment status:", error);
      return {
        isPaid: false,
        tier: "free",
        provider: null,
        amount: null,
        currency: null,
        paymentDate: null,
        expiryDate: null,
        canMakePayment: true,
      };
    }
  }

  /**
   * Listen to payment status changes in real-time
   */
  static subscribeToPaymentChanges(
    userId: string,
    callback: (paymentInfo: UserPaymentInfo | null) => void
  ) {
    const subscription = supabase
      .channel("payment-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${userId}`,
        },
        async () => {
          // Fetch updated payment info when profile changes
          try {
            const paymentInfo = await this.getUserPaymentInfo(true);
            callback(paymentInfo);
          } catch (error) {
            console.error("Error fetching updated payment info:", error);
            callback(null);
          }
        }
      )
      .subscribe();

    return subscription;
  }
}
