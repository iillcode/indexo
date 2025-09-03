"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/app/components/landing/Buttons";
import { CheckCircle2, XCircleIcon, Loader2, Crown } from "lucide-react";
import {
  LemonSqueezyService,
  type LemonSqueezyProduct,
} from "@/lib/lemonsqueezy";
import { LEMONSQUEEZY_CONFIG } from "@/lib/lemonsqueezy-config";
import { useAuth } from "@/contexts/AuthContext";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";

function PricingCardDemo() {
  const { user, profile } = useAuth();
  const paymentStatus = usePaymentStatus();
  // Derive canMakePayment locally to avoid double-calling the hook
  const canMakePayment = !!user && paymentStatus.canMakePayment && !paymentStatus.isPaid;
  const reason = paymentStatus.isPaid
    ? "You already have an active subscription"
    : !paymentStatus.canMakePayment
    ? "Payment not available at this time"
    : null;
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<LemonSqueezyProduct | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shouldShowLoading, setShouldShowLoading] = useState(true);
  const [guestEmail, setGuestEmail] = useState<string>("");

  // Helper function to format price (remove .00)
  const formatPrice = (price: string): string => {
    return price.replace(/\.00$/, "");
  };

  // Basic email validation for guest checkout
  const isValidEmail = (email: string) => {
    return /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);
  };

  // LemonSqueezy Product ID - Replace with your actual product ID
  const PRODUCT_ID = LEMONSQUEEZY_CONFIG.PRODUCT_ID;

  // Load product details on component mount
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setError(null);
        const productData = await LemonSqueezyService.getProduct(PRODUCT_ID);
        setProduct(productData);
      } catch (err) {
        console.error("Failed to load product:", err);
        setError(err instanceof Error ? err.message : "Failed to load product");
      }
    };

    loadProduct();
  }, []);

  // Handle page visibility changes (tab switching, browser navigation, etc.)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // When page becomes visible, only show loading if we don't have data
        if (!paymentStatus.isLoading && paymentStatus.tier !== "free") {
          setShouldShowLoading(false);
        }
      }
    };

    // Check initial state
    if (!paymentStatus.isLoading) {
      setShouldShowLoading(false);
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [paymentStatus.isLoading, paymentStatus.tier]);

  // Handle window focus events (browser navigation, tab switching)
  useEffect(() => {
    const handleFocus = () => {
      // When window regains focus, only show loading if we don't have data
      if (!paymentStatus.isLoading && paymentStatus.tier !== "free") {
        setShouldShowLoading(false);
      }
    };

    window.addEventListener("focus", handleFocus);

    // Cleanup
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [paymentStatus.isLoading, paymentStatus.tier]);

  const handleCheckout = async () => {
    if (!product) {
      setError("Product not loaded yet. Please try again.");
      return;
    }

    // Logged-in flow: respect existing payment gating
    if (user) {
      if (!canMakePayment) {
        setError(reason || "Unable to process payment at this time.");
        return;
      }
    } else {
      // Guest flow: require a valid email
      if (!isValidEmail(guestEmail)) {
        setError("Please enter a valid email to continue as a guest.");
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create checkout request with user or guest information
      const checkoutRequest = {
        productId: PRODUCT_ID,
        userId: user?.id,
        userEmail: user?.email || profile?.email || guestEmail,
      };

      await LemonSqueezyService.checkoutAndRedirect(checkoutRequest);
    } catch (err) {
      console.error("Checkout failed:", err);
      setError(err instanceof Error ? err.message : "Checkout failed");
      setIsLoading(false);
    }
  };

  const features = [
    "Up to 3 projects",
    "Basic templates",
    "Community support",
    "1GB storage",
  ];

  const lockedFeatures = [
    "Unlimited projects",
    "Premium templates",
    "Priority support",
  ];

  return (
    <div
      className={cn(
        "bg-card relative w-full max-w-sm rounded-xl dark:bg-transparent",
        "p-1.5 shadow-xl backdrop-blur-xl",
        "dark:border-border/80 border"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "bg-muted/80 dark:bg-muted/50 relative mb-4 rounded-xl border p-6"
        )}
      >
        {/* Top glass gradient */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-48 rounded-[inherit]"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 40%, rgba(0,0,0,0) 100%)",
          }}
        />

        {/* Plan Info */}
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-2">
            {product ? product.attributes.name : "Indie Kit"}{" "}
            <span className="text-muted-foreground font-normal">
              AI-optimised
            </span>
          </h3>
          <p className="text-muted-foreground text-sm">
            {product?.attributes.description
              ? product.attributes.description
                  .replace(/<[^>]*>/g, "")
                  .substring(0, 100) + "..."
              : "Perfect Starter Kit for building B2C products"}
          </p>
        </div>

        {/* Price */}
        <div className="mb-4 text-center">
          <div className="flex items-end justify-center gap-2 mb-3">
            <span className="text-6xl font-bold tracking-tight text-foreground">
              {product
                ? formatPrice(product.attributes.price_formatted)
                : "$79"}
            </span>
            <div className="flex flex-col items-start pb-1">
              <span className="text-muted-foreground text-sm line-through">
                {product ? formatPrice("$349.00") : "$349"}
              </span>
              <span className="text-green-500 text-sm font-medium">
                {product ? formatPrice("$270.00") : "$270"} off
              </span>
            </div>
          </div>
        </div>

        {/* Guest Email (shown when not logged in) */}
        {!user && (
          <div className="mb-3">
            <label className="block text-xs text-muted-foreground mb-1">
              Email for receipt and account linking
            </label>
            <input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="you@example.com"
              className={cn(
                "w-full rounded-md border bg-background px-3 py-2 text-sm",
                "focus:outline-none focus:ring-2 focus:ring-orange-500/60",
                "placeholder:text-muted-foreground/70"
              )}
            />
            <p className="mt-1 text-[10px] text-muted-foreground">
              We'll send your receipt here. If you sign up later with this email,
              your purchase will be linked automatically.
            </p>
          </div>
        )}

        {/* Button */}
        {shouldShowLoading && paymentStatus.isLoading ? (
          <Button
            className="w-full font-semibold text-white mb-3 opacity-70 cursor-not-allowed"
            disabled
          >
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Checking Status...
          </Button>
        ) : paymentStatus.isPaid ? (
          <Button
            className={cn(
              "w-full font-semibold text-white mb-3",
              "bg-gradient-to-b from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg"
            )}
            disabled
          >
            <Crown className="mr-2 h-4 w-4" />
            {paymentStatus.tier === "pro" ? "Pro Member" : "Paid Member"}
          </Button>
        ) : (
          <Button
            className={cn(
              "w-full font-semibold text-white mb-3",
              "bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg",
              isLoading && "opacity-70 cursor-not-allowed"
            )}
            onClick={handleCheckout}
            disabled={
              isLoading ||
              !product ||
              (!user && !isValidEmail(guestEmail))
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : user && !canMakePayment ? (
              "Already Purchased"
            ) : (
              "Get Indexo"
            )}
          </Button>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-3 text-center text-red-500 text-xs">{error}</div>
        )}

        {/* Status Message */}
        {paymentStatus.isPaid ? (
          <p className="text-center text-green-500 text-xs">
            ✓ You are a {paymentStatus.tier} member
            {paymentStatus.provider && ` via ${paymentStatus.provider}`}
          </p>
        ) : !user ? (
          <p className="text-center text-muted-foreground text-xs">
            Guest checkout available — enter your email above to continue
          </p>
        ) : (
          <p className="text-center text-muted-foreground text-xs">
            $270 off for the first 450 customers (16 left)
          </p>
        )}
      </div>

      {/* Body */}
      <div className="space-y-6 p-3">
        {/* Features List */}
        <ul className="space-y-3">
          {features.map((item, index) => (
            <li
              key={index}
              className="text-muted-foreground flex items-start gap-3 text-sm"
            >
              <span className="mt-0.5">
                <CheckCircle2
                  className="h-4 w-4 text-green-500"
                  aria-hidden="true"
                />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* Separator */}
        <div className="text-muted-foreground flex items-center gap-3 text-sm">
          <span className="bg-muted-foreground/40 h-[1px] flex-1" />
          <span className="text-muted-foreground shrink-0">Pro features</span>
          <span className="bg-muted-foreground/40 h-[1px] flex-1" />
        </div>

        {/* Locked Features List */}
        <ul className="space-y-3">
          {lockedFeatures.map((item, index) => (
            <li
              key={index}
              className="text-muted-foreground flex items-start gap-3 text-sm opacity-75"
            >
              <span className="mt-0.5">
                <XCircleIcon
                  className="text-destructive h-4 w-4"
                  aria-hidden="true"
                />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function PricingDemo() {
  return (
    <section className="relative py-16" id="pricing">
      {/* Subtle dotted grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.08) 0.8px, transparent 0.8px)",
          backgroundSize: "14px 14px",
          maskImage:
            "radial-gradient( circle at 50% 10%, rgba(0,0,0,1), rgba(0,0,0,0.2) 40%, rgba(0,0,0,0) 70% )",
        }}
      />
      {/* Radial spotlight */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -top-1 left-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 rounded-full",
          "bg-[radial-gradient(ellipse_at_center,--theme(--color-foreground/.1),transparent_50%)]",
          "blur-[30px]"
        )}
      />

      {/* Header Section */}
      <div className="relative mx-auto max-w-3xl sm:text-center mb-12">
        <h3 className="font-geist mt-4 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-ellipsis">
          Get everything you need to start building
        </h3>
        <p className="font-geist text-foreground/60 mt-4">
          Everything you need to launch your next big idea.
        </p>
      </div>

      <div className="relative z-10 flex items-center justify-center">
        <PricingCardDemo />
      </div>
    </section>
  );
}
