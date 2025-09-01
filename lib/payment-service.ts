import { supabase } from "./supabase";

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
   * Get the current user's payment information
   */
  static async getUserPaymentInfo(): Promise<UserPaymentInfo | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase.rpc("get_user_payment_info", {
        user_uuid: user.id,
      });

      if (error) {
        console.error("Error fetching user payment info:", error);
        throw error;
      }

      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error("Error in getUserPaymentInfo:", error);
      throw error;
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
      return false; // Err on the side of caution
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

      const isPaid = await this.isPaidUser();

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
        canMakePayment: false,
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
            const paymentInfo = await this.getUserPaymentInfo();
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
