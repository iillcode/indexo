"use client";

import React from "react";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, CreditCard, Calendar, DollarSign } from "lucide-react";

export function UserPaymentInfo() {
  const paymentStatus = usePaymentStatus();

  if (paymentStatus.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (paymentStatus.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-red-500 text-sm">{paymentStatus.error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAmount = (amount: number | null, currency: string | null) => {
    if (!amount || !currency) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tier Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Current Tier:</span>
          <Badge
            variant={paymentStatus.isPaid ? "default" : "secondary"}
            className={
              paymentStatus.isPaid
                ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                : ""
            }
          >
            {paymentStatus.isPaid && <Crown className="w-3 h-3 mr-1" />}
            {paymentStatus.tier.charAt(0).toUpperCase() +
              paymentStatus.tier.slice(1)}
          </Badge>
        </div>

        {paymentStatus.isPaid && (
          <>
            {/* Payment Provider */}
            {paymentStatus.provider && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Provider:</span>
                <span className="text-sm text-muted-foreground capitalize">
                  {paymentStatus.provider}
                </span>
              </div>
            )}

            {/* Payment Amount */}
            {paymentStatus.amount && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  Amount Paid:
                </span>
                <span className="text-sm font-semibold">
                  {formatAmount(paymentStatus.amount, paymentStatus.currency)}
                </span>
              </div>
            )}

            {/* Payment Date */}
            {paymentStatus.paymentDate && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Purchase Date:
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatDate(paymentStatus.paymentDate)}
                </span>
              </div>
            )}

            {/* Expiry Date */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Expires:</span>
              <span className="text-sm text-muted-foreground">
                {paymentStatus.expiryDate
                  ? formatDate(paymentStatus.expiryDate)
                  : "Never"}
              </span>
            </div>
          </>
        )}

        {/* Payment Capability */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Can Make Payment:</span>
            <Badge
              variant={paymentStatus.canMakePayment ? "default" : "destructive"}
            >
              {paymentStatus.canMakePayment ? "Yes" : "No"}
            </Badge>
          </div>
          {!paymentStatus.canMakePayment && paymentStatus.isPaid && (
            <p className="text-xs text-muted-foreground mt-1">
              You already have an active plan
            </p>
          )}
        </div>

        {/* Status Summary */}
        <div className="p-3 bg-muted rounded-md">
          <p className="text-sm">
            {paymentStatus.isPaid ? (
              <span className="text-green-600 dark:text-green-400">
                ✓ You have full access to all features
              </span>
            ) : (
              <span className="text-muted-foreground">
                Upgrade to unlock premium features
              </span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
