import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  PaymentService,
  type UserPaymentInfo,
  type PaymentStatusResult,
} from "@/lib/payment-service";

export interface PaymentStatus extends PaymentStatusResult {
  isLoading: boolean;
  error: string | null;
}

export function usePaymentStatus(): PaymentStatus {
  const { user } = useAuth();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    isPaid: false,
    tier: "free",
    provider: null,
    amount: null,
    currency: null,
    paymentDate: null,
    expiryDate: null,
    canMakePayment: true,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!user) {
        setPaymentStatus({
          isPaid: false,
          tier: "free",
          provider: null,
          amount: null,
          currency: null,
          paymentDate: null,
          expiryDate: null,
          canMakePayment: true,
          isLoading: false,
          error: null,
        });
        return;
      }

      try {
        setPaymentStatus((prev) => ({ ...prev, isLoading: true, error: null }));
        const status = await PaymentService.getPaymentStatus();

        setPaymentStatus({
          ...status,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        console.error("Failed to check payment status:", err);
        setPaymentStatus((prev) => ({
          ...prev,
          isLoading: false,
          error:
            err instanceof Error
              ? err.message
              : "Failed to load payment status",
        }));
      }
    };

    checkPaymentStatus();

    // Set up real-time subscription if user is logged in
    let subscription: any;
    if (user) {
      subscription = PaymentService.subscribeToPaymentChanges(
        user.id,
        (paymentInfo: UserPaymentInfo | null) => {
          if (paymentInfo) {
            setPaymentStatus((prev) => ({
              ...prev,
              isPaid: paymentInfo.is_paid_user,
              tier: paymentInfo.user_tier,
              provider: paymentInfo.payment_provider,
              amount: paymentInfo.payment_amount,
              currency: paymentInfo.payment_currency,
              paymentDate: paymentInfo.payment_date,
              expiryDate: paymentInfo.expiry_date,
              canMakePayment: paymentInfo.can_make_payment,
            }));
          }
        }
      );
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [user]);

  return paymentStatus;
}

/**
 * Hook to check if user can access premium features
 */
export function usePremiumAccess(): {
  hasPremiumAccess: boolean;
  tier: string;
  isLoading: boolean;
} {
  const paymentStatus = usePaymentStatus();

  return {
    hasPremiumAccess: paymentStatus.isPaid,
    tier: paymentStatus.tier,
    isLoading: paymentStatus.isLoading,
  };
}

/**
 * Hook to check if user can make a payment
 */
export function useCanMakePayment(): {
  canMakePayment: boolean;
  reason: string | null;
  isLoading: boolean;
} {
  const paymentStatus = usePaymentStatus();
  const { user } = useAuth();

  let reason: string | null = null;

  if (!user) {
    reason = "Please log in to make a purchase";
  } else if (paymentStatus.isPaid) {
    reason = "You already have an active subscription";
  } else if (!paymentStatus.canMakePayment) {
    reason = "Payment not available at this time";
  }

  return {
    canMakePayment: paymentStatus.canMakePayment && !!user,
    reason,
    isLoading: paymentStatus.isLoading,
  };
}
