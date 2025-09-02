import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { verifyLemonSqueezySignature } from "../_shared/webhook-verification.ts";

// LemonSqueezy-only webhook handler
console.log("LemonSqueezy webhook handler loaded");

// Helper function to update user payment status in profile
interface PaymentStatusUpdate {
  userId: string;
  provider: string;
  amount: number;
  currency: string;
  status: string;
  expiryType?: string;
  tier?: string;
}

async function updateUserPaymentStatus(
  supabase: any,
  update: PaymentStatusUpdate
) {
  try {
    console.log(`Updating payment status for user ${update.userId}`);

    // Calculate expiry date based on type
    let expiryDate: Date | null = null;
    const now = new Date();

    switch (update.expiryType || "never") {
      case "monthly":
        const monthlyDate = new Date(now);
        monthlyDate.setMonth(monthlyDate.getMonth() + 1);
        expiryDate = monthlyDate;
        break;
      case "yearly":
        const yearlyDate = new Date(now);
        yearlyDate.setFullYear(yearlyDate.getFullYear() + 1);
        expiryDate = yearlyDate;
        break;
      case "one_time":
        // Effectively never for one-time purchases
        const oneTimeDate = new Date(now);
        oneTimeDate.setFullYear(oneTimeDate.getFullYear() + 100);
        expiryDate = oneTimeDate;
        break;
      default:
        // 'never' case - keep expiryDate as null
        break;
    }

    // Update user profile with payment information using direct query
    const { data, error } = await supabase
      .from("profiles")
      .update({
        user_tier: update.tier || "pro",
        payment_provider: update.provider,
        payment_amount: update.amount,
        payment_currency: update.currency,
        payment_status: update.status,
        payment_date: new Date().toISOString(),
        expiry_date: expiryDate ? expiryDate.toISOString() : null,
        expiry_type: update.expiryType || "never",
        is_paid_user: update.status === "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", update.userId);

    if (error) {
      console.error("Error updating user payment status:", error);
      throw error;
    }

    console.log(
      `User payment status updated successfully for user ${update.userId}`
    );
    return data;
  } catch (error) {
    console.error("Failed to update user payment status:", error);
    throw error;
  }
}

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the raw body for signature verification
    const body = await req.text();
    const lemonSignature = req.headers.get("x-signature");

    const lemonWebhookSecret = Deno.env.get("LEMONSQUEEZY_WEBHOOK_SECRET");

    let isValidSignature = false;
    let webhookProvider = "unknown";

    // Verify LemonSqueezy signature (only supported provider now)
    if (lemonSignature && lemonWebhookSecret) {
      isValidSignature = await verifyLemonSqueezySignature(
        body,
        lemonSignature,
        lemonWebhookSecret
      );
      webhookProvider = "lemonsqueezy";
    } else {
      console.error("No valid webhook signature found");
      return new Response("Webhook signature missing", { status: 400 });
    }

    if (!isValidSignature) {
      console.error(`Invalid ${webhookProvider} webhook signature`);
      return new Response("Invalid signature", { status: 400 });
    }

    console.log(`Processing ${webhookProvider} webhook`);

    // Parse the event
    let event;
    try {
      event = JSON.parse(body);
    } catch (err) {
      console.error("Failed to parse webhook body:", err);
      return new Response("Invalid JSON", { status: 400 });
    }

    console.log(
      `Processing ${webhookProvider} webhook event: ${event.meta?.event_name}`
    );

    // Use service role key for admin access in webhooks
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Handle LemonSqueezy events (Stripe support has been removed)
    if (webhookProvider === "lemonsqueezy") {
      const eventName = event.meta?.event_name;
      switch (eventName) {
        case "affiliate_activated":
          await handleLemonSqueezyAffiliateActivated(
            supabaseClient,
            event.data
          );
          break;

        case "order_created":
          await handleLemonSqueezyOrderCreated(supabaseClient, event.data);
          break;

        case "order_refunded":
          await handleLemonSqueezyOrderRefunded(supabaseClient, event.data);
          break;

        case "subscription_created":
          await handleLemonSqueezySubscriptionCreated(
            supabaseClient,
            event.data
          );
          break;

        case "subscription_updated":
          await handleLemonSqueezySubscriptionUpdated(
            supabaseClient,
            event.data
          );
          break;

        case "subscription_cancelled":
          await handleLemonSqueezySubscriptionCancelled(
            supabaseClient,
            event.data
          );
          break;

        case "subscription_resumed":
          await handleLemonSqueezySubscriptionResumed(
            supabaseClient,
            event.data
          );
          break;

        case "subscription_expired":
          await handleLemonSqueezySubscriptionExpired(
            supabaseClient,
            event.data
          );
          break;

        case "subscription_paused":
          await handleLemonSqueezySubscriptionPaused(
            supabaseClient,
            event.data
          );
          break;

        case "subscription_unpaused":
          await handleLemonSqueezySubscriptionUnpaused(
            supabaseClient,
            event.data
          );
          break;

        case "subscription_payment_failed":
          await handleLemonSqueezySubscriptionPaymentFailed(
            supabaseClient,
            event.data
          );
          break;

        case "subscription_payment_success":
          await handleLemonSqueezySubscriptionPaymentSuccess(
            supabaseClient,
            event.data
          );
          break;

        case "subscription_payment_recovered":
          await handleLemonSqueezySubscriptionPaymentRecovered(
            supabaseClient,
            event.data
          );
          break;

        case "subscription_payment_refunded":
          await handleLemonSqueezySubscriptionPaymentRefunded(
            supabaseClient,
            event.data
          );
          break;

        case "subscription_plan_changed":
          await handleLemonSqueezySubscriptionPlanChanged(
            supabaseClient,
            event.data
          );
          break;

        case "license_key_created":
          await handleLemonSqueezyLicenseKeyCreated(supabaseClient, event.data);
          break;

        case "license_key_updated":
          await handleLemonSqueezyLicenseKeyUpdated(supabaseClient, event.data);
          break;

        default:
          console.log(`Unhandled LemonSqueezy event type: ${eventName}`);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

// LemonSqueezy webhook handlers (all Stripe handlers have been removed)

async function handleLemonSqueezyOrderCreated(supabase: any, orderData: any) {
  console.log("Processing LemonSqueezy order created:", orderData.id);

  try {
    const order = orderData.attributes;
    const firstOrderItem = order.first_order_item;

    // Try to find user by email lookup
    let userId = null;
    if (order.user_email) {
      try {
        const { data: userLookup, error: lookupError } = await supabase.rpc(
          "lookup_user_by_email",
          { email_address: order.user_email }
        );

        if (!lookupError && userLookup) {
          userId = userLookup;
          console.log(`Found user ${userId} for email ${order.user_email}`);
        } else {
          console.log(
            `No user found for email ${order.user_email}, proceeding without user_id`
          );
        }
      } catch (lookupErr) {
        console.log(`User lookup failed for ${order.user_email}:`, lookupErr);
      }
    }

    // Store in payments table (removed lemon_orders table usage)
    const paymentData = {
      user_id: userId, // Can be null
      order_id: orderData.id,
      order_number: order.order_number,
      identifier: order.identifier,
      store_id: order.store_id,
      lemon_customer_id: order.customer_id,
      product_id: firstOrderItem?.product_id,
      variant_id: firstOrderItem?.variant_id,
      product_name: firstOrderItem?.product_name,
      variant_name: firstOrderItem?.variant_name,
      price_id: firstOrderItem?.price_id,
      quantity: firstOrderItem?.quantity || 1,
      amount: order.total / 100, // Convert from cents
      subtotal: order.subtotal / 100,
      tax: order.tax / 100,
      tax_rate: order.tax_rate,
      tax_name: order.tax_name,
      tax_inclusive: order.tax_inclusive,
      discount_total: order.discount_total / 100,
      setup_fee: order.setup_fee / 100,
      currency: order.currency,
      currency_rate: parseFloat(order.currency_rate),
      status: order.status === "paid" ? "completed" : order.status,
      payment_method: "lemonsqueezy",
      customer_email: order.user_email,
      refunded: order.refunded,
      refunded_amount: order.refunded_amount / 100,
      refunded_at: order.refunded_at,
      test_mode: order.test_mode,
      total_formatted: order.total_formatted,
      subtotal_formatted: order.subtotal_formatted,
      tax_formatted: order.tax_formatted,
      discount_formatted: order.discount_total_formatted,
      setup_fee_formatted: order.setup_fee_formatted,
      refunded_amount_formatted: order.refunded_amount_formatted,
      receipt_url: order.urls?.receipt,
      provider: "lemonsqueezy",
      metadata: {
        ...order.metadata,
        first_order_item: firstOrderItem,
        relationships: orderData.relationships,
        user_lookup_attempted: true,
        user_found: userId !== null,
      },
      created_at: order.created_at,
      updated_at: order.updated_at,
    };

    // Use upsert to handle both insert and update cases
    // This will insert a new record if no matching order_id is found,
    // or update the existing record if it exists
    const { data: paymentDataResult, error: paymentError } = await supabase
      .from("payments")
      .upsert(paymentData, {
        onConflict: "order_id",
        ignoreDuplicates: false,
      });

    if (paymentError) {
      console.error("Error upserting payment record:", paymentError);
      throw paymentError;
    }

    console.log("LemonSqueezy order processed successfully:", {
      payment: paymentDataResult,
      userFound: userId !== null,
      email: order.user_email,
    });

    // Update user payment status in profile if user was found and payment is completed
    if (userId && order.status === "paid") {
      await updateUserPaymentStatus(supabase, {
        userId,
        provider: "lemonsqueezy",
        amount: order.total / 100, // Convert from cents
        currency: order.currency,
        status: "completed",
        expiryType: "never", // Assuming one-time payment
      });
    }
  } catch (error) {
    console.error("Error in handleLemonSqueezyOrderCreated:", error);
    throw error;
  }
}

async function handleLemonSqueezyOrderRefunded(supabase: any, orderData: any) {
  console.log("Processing LemonSqueezy order refunded:", orderData.id);

  try {
    const order = orderData.attributes;

    // Update payments table (removed lemon_orders table usage)
    const { error: paymentError } = await supabase.from("payments").upsert(
      {
        order_id: orderData.id,
        status: "refunded",
        refunded: true,
        refunded_amount: order.refunded_amount / 100,
        refunded_at: order.refunded_at || new Date().toISOString(),
        refunded_amount_formatted: order.refunded_amount_formatted,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "order_id",
        ignoreDuplicates: false,
      }
    );

    if (paymentError) {
      console.error("Error upserting payment refund:", paymentError);
      throw paymentError;
    }

    console.log("LemonSqueezy order refund processed successfully");
  } catch (error) {
    console.error("Error in handleLemonSqueezyOrderRefunded:", error);
    throw error;
  }
}

async function handleLemonSqueezySubscriptionCreated(
  supabase: any,
  subscriptionData: any
) {
  console.log(
    "Processing LemonSqueezy subscription created:",
    subscriptionData.id
  );

  try {
    const subscription = subscriptionData.attributes;

    const subscriptionRecord = {
      // user_id will be set when we have proper user lookup
      subscription_id: subscriptionData.id,
      customer_id: subscription.customer_id?.toString(),
      status: subscription.status,
      plan_id: subscription.variant_id?.toString(),
      plan_name: subscription.variant_name || subscription.product_name,
      current_period_start: subscription.renews_at,
      current_period_end: subscription.ends_at,
      cancel_at_period_end: subscription.cancelled,
      canceled_at: subscription.cancelled ? subscription.ends_at : null,
      trial_start: subscription.trial_ends_at ? subscription.created_at : null,
      trial_end: subscription.trial_ends_at,
      metadata: {
        ...subscription,
        provider: "lemonsqueezy",
      },
      created_at: subscription.created_at,
      updated_at: subscription.updated_at,
    };

    const { data, error } = await supabase
      .from("subscriptions")
      .upsert(subscriptionRecord, {
        onConflict: "subscription_id",
        ignoreDuplicates: false,
      });

    if (error) {
      console.error("Error upserting LemonSqueezy subscription:", error);
      throw error;
    }

    console.log("LemonSqueezy subscription created successfully:", data);
  } catch (error) {
    console.error("Error in handleLemonSqueezySubscriptionCreated:", error);
    throw error;
  }
}

async function handleLemonSqueezySubscriptionUpdated(
  supabase: any,
  subscriptionData: any
) {
  console.log(
    "Processing LemonSqueezy subscription updated:",
    subscriptionData.id
  );

  try {
    const subscription = subscriptionData.attributes;

    const updateData = {
      subscription_id: subscriptionData.id,
      status: subscription.status,
      plan_id: subscription.variant_id?.toString(),
      plan_name: subscription.variant_name || subscription.product_name,
      current_period_start: subscription.renews_at,
      current_period_end: subscription.ends_at,
      cancel_at_period_end: subscription.cancelled,
      canceled_at: subscription.cancelled ? subscription.ends_at : null,
      trial_end: subscription.trial_ends_at,
      metadata: {
        ...subscription,
        provider: "lemonsqueezy",
      },
      updated_at: subscription.updated_at,
    };

    const { data, error } = await supabase
      .from("subscriptions")
      .upsert(updateData, {
        onConflict: "subscription_id",
        ignoreDuplicates: false,
      });

    if (error) {
      console.error("Error upserting LemonSqueezy subscription:", error);
      throw error;
    }

    console.log("LemonSqueezy subscription updated successfully:", data);
  } catch (error) {
    console.error("Error in handleLemonSqueezySubscriptionUpdated:", error);
    throw error;
  }
}

async function handleLemonSqueezySubscriptionCancelled(
  supabase: any,
  subscriptionData: any
) {
  console.log(
    "Processing LemonSqueezy subscription cancelled:",
    subscriptionData.id
  );

  try {
    const subscription = subscriptionData.attributes;

    const updateData = {
      subscription_id: subscriptionData.id,
      status: "canceled",
      cancel_at_period_end: true,
      canceled_at: subscription.ends_at || new Date().toISOString(),
      ended_at: subscription.ends_at,
      metadata: {
        ...subscription,
        provider: "lemonsqueezy",
      },
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("subscriptions")
      .upsert(updateData, {
        onConflict: "subscription_id",
        ignoreDuplicates: false,
      });

    if (error) {
      console.error("Error upserting LemonSqueezy subscription:", error);
      throw error;
    }

    console.log("LemonSqueezy subscription cancelled successfully:", data);
  } catch (error) {
    console.error("Error in handleLemonSqueezySubscriptionCancelled:", error);
    throw error;
  }
}

// Additional LemonSqueezy event handlers

async function handleLemonSqueezyAffiliateActivated(
  supabase: any,
  affiliateData: any
) {
  console.log("Processing LemonSqueezy affiliate activated:", affiliateData.id);

  try {
    const affiliate = affiliateData.attributes;

    // Store affiliate activation event
    const affiliateRecord = {
      affiliate_id: affiliateData.id,
      user_email: affiliate.email,
      commission_rate: affiliate.commission_rate,
      status: "active",
      activated_at: affiliate.created_at || new Date().toISOString(),
      metadata: {
        ...affiliate,
        provider: "lemonsqueezy",
        event_type: "affiliate_activated",
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Log to payments table for tracking
    const { data, error } = await supabase.from("payments").insert({
      payment_method: "affiliate_activation",
      status: "affiliate_activated",
      provider: "lemonsqueezy",
      customer_email: affiliate.email,
      metadata: affiliateRecord,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error recording affiliate activation:", error);
      throw error;
    }

    console.log(
      "LemonSqueezy affiliate activation recorded successfully:",
      data
    );
  } catch (error) {
    console.error("Error in handleLemonSqueezyAffiliateActivated:", error);
    throw error;
  }
}

async function handleLemonSqueezySubscriptionResumed(
  supabase: any,
  subscriptionData: any
) {
  console.log(
    "Processing LemonSqueezy subscription resumed:",
    subscriptionData.id
  );

  try {
    const subscription = subscriptionData.attributes;

    const updateData = {
      status: subscription.status || "active",
      cancel_at_period_end: false,
      canceled_at: null,
      current_period_start: subscription.renews_at,
      current_period_end: subscription.ends_at,
      metadata: {
        ...subscription,
        provider: "lemonsqueezy",
      },
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("subscriptions")
      .update(updateData)
      .eq("subscription_id", subscriptionData.id);

    if (error) {
      console.error("Error resuming LemonSqueezy subscription:", error);
      throw error;
    }

    console.log("LemonSqueezy subscription resumed successfully:", data);
  } catch (error) {
    console.error("Error in handleLemonSqueezySubscriptionResumed:", error);
    throw error;
  }
}

async function handleLemonSqueezySubscriptionExpired(
  supabase: any,
  subscriptionData: any
) {
  console.log(
    "Processing LemonSqueezy subscription expired:",
    subscriptionData.id
  );

  try {
    const subscription = subscriptionData.attributes;

    const updateData = {
      status: "expired",
      ended_at: subscription.ends_at || new Date().toISOString(),
      metadata: {
        ...subscription,
        provider: "lemonsqueezy",
      },
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("subscriptions")
      .update(updateData)
      .eq("subscription_id", subscriptionData.id);

    if (error) {
      console.error("Error expiring LemonSqueezy subscription:", error);
      throw error;
    }

    console.log("LemonSqueezy subscription expired successfully:", data);
  } catch (error) {
    console.error("Error in handleLemonSqueezySubscriptionExpired:", error);
    throw error;
  }
}

async function handleLemonSqueezySubscriptionPaused(
  supabase: any,
  subscriptionData: any
) {
  console.log(
    "Processing LemonSqueezy subscription paused:",
    subscriptionData.id
  );

  try {
    const subscription = subscriptionData.attributes;

    const updateData = {
      status: "paused",
      metadata: {
        ...subscription,
        provider: "lemonsqueezy",
        paused_at: new Date().toISOString(),
      },
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("subscriptions")
      .update(updateData)
      .eq("subscription_id", subscriptionData.id);

    if (error) {
      console.error("Error pausing LemonSqueezy subscription:", error);
      throw error;
    }

    console.log("LemonSqueezy subscription paused successfully:", data);
  } catch (error) {
    console.error("Error in handleLemonSqueezySubscriptionPaused:", error);
    throw error;
  }
}

async function handleLemonSqueezySubscriptionUnpaused(
  supabase: any,
  subscriptionData: any
) {
  console.log(
    "Processing LemonSqueezy subscription unpaused:",
    subscriptionData.id
  );

  try {
    const subscription = subscriptionData.attributes;

    const updateData = {
      status: subscription.status || "active",
      metadata: {
        ...subscription,
        provider: "lemonsqueezy",
        unpaused_at: new Date().toISOString(),
      },
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("subscriptions")
      .update(updateData)
      .eq("subscription_id", subscriptionData.id);

    if (error) {
      console.error("Error unpausing LemonSqueezy subscription:", error);
      throw error;
    }

    console.log("LemonSqueezy subscription unpaused successfully:", data);
  } catch (error) {
    console.error("Error in handleLemonSqueezySubscriptionUnpaused:", error);
    throw error;
  }
}

async function handleLemonSqueezySubscriptionPaymentFailed(
  supabase: any,
  subscriptionData: any
) {
  console.log(
    "Processing LemonSqueezy subscription payment failed:",
    subscriptionData.id
  );

  try {
    const subscription = subscriptionData.attributes;

    // Create a failed payment record
    const paymentData = {
      subscription_id: subscriptionData.id,
      amount: subscription.unit_price ? subscription.unit_price / 100 : 0,
      currency: subscription.currency || "USD",
      status: "failed",
      payment_method: "subscription",
      customer_email: subscription.user_email,
      lemon_customer_id: subscription.customer_id,
      provider: "lemonsqueezy",
      metadata: {
        ...subscription,
        event_type: "subscription_payment_failed",
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from("payments").insert(paymentData);

    if (error) {
      console.error("Error recording subscription payment failure:", error);
      throw error;
    }

    console.log(
      "LemonSqueezy subscription payment failure recorded successfully:",
      data
    );
  } catch (error) {
    console.error(
      "Error in handleLemonSqueezySubscriptionPaymentFailed:",
      error
    );
    throw error;
  }
}

async function handleLemonSqueezySubscriptionPaymentSuccess(
  supabase: any,
  subscriptionData: any
) {
  console.log(
    "Processing LemonSqueezy subscription payment success:",
    subscriptionData.id
  );

  try {
    const subscription = subscriptionData.attributes;

    // Create a successful payment record
    const paymentData = {
      subscription_id: subscriptionData.id,
      amount: subscription.unit_price ? subscription.unit_price / 100 : 0,
      currency: subscription.currency || "USD",
      status: "completed",
      payment_method: "subscription",
      customer_email: subscription.user_email,
      lemon_customer_id: subscription.customer_id,
      provider: "lemonsqueezy",
      metadata: {
        ...subscription,
        event_type: "subscription_payment_success",
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from("payments").insert(paymentData);

    if (error) {
      console.error("Error recording subscription payment success:", error);
      throw error;
    }

    console.log(
      "LemonSqueezy subscription payment success recorded successfully:",
      data
    );
  } catch (error) {
    console.error(
      "Error in handleLemonSqueezySubscriptionPaymentSuccess:",
      error
    );
    throw error;
  }
}

async function handleLemonSqueezySubscriptionPaymentRecovered(
  supabase: any,
  subscriptionData: any
) {
  console.log(
    "Processing LemonSqueezy subscription payment recovered:",
    subscriptionData.id
  );

  try {
    const subscription = subscriptionData.attributes;

    // Create a recovered payment record
    const paymentData = {
      subscription_id: subscriptionData.id,
      amount: subscription.unit_price ? subscription.unit_price / 100 : 0,
      currency: subscription.currency || "USD",
      status: "recovered",
      payment_method: "subscription",
      customer_email: subscription.user_email,
      lemon_customer_id: subscription.customer_id,
      provider: "lemonsqueezy",
      metadata: {
        ...subscription,
        event_type: "subscription_payment_recovered",
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from("payments").insert(paymentData);

    if (error) {
      console.error("Error recording subscription payment recovery:", error);
      throw error;
    }

    // Also update subscription status
    await supabase
      .from("subscriptions")
      .update({
        status: subscription.status || "active",
        metadata: {
          ...subscription,
          provider: "lemonsqueezy",
          payment_recovered_at: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      })
      .eq("subscription_id", subscriptionData.id);

    console.log(
      "LemonSqueezy subscription payment recovery recorded successfully:",
      data
    );
  } catch (error) {
    console.error(
      "Error in handleLemonSqueezySubscriptionPaymentRecovered:",
      error
    );
    throw error;
  }
}

async function handleLemonSqueezySubscriptionPaymentRefunded(
  supabase: any,
  subscriptionData: any
) {
  console.log(
    "Processing LemonSqueezy subscription payment refunded:",
    subscriptionData.id
  );

  try {
    const subscription = subscriptionData.attributes;

    // Create a refunded payment record
    const paymentData = {
      subscription_id: subscriptionData.id,
      amount: subscription.unit_price ? subscription.unit_price / 100 : 0,
      currency: subscription.currency || "USD",
      status: "refunded",
      payment_method: "subscription",
      customer_email: subscription.user_email,
      lemon_customer_id: subscription.customer_id,
      refunded: true,
      refunded_amount: subscription.unit_price
        ? subscription.unit_price / 100
        : 0,
      refunded_at: new Date().toISOString(),
      provider: "lemonsqueezy",
      metadata: {
        ...subscription,
        event_type: "subscription_payment_refunded",
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from("payments").insert(paymentData);

    if (error) {
      console.error("Error recording subscription payment refund:", error);
      throw error;
    }

    console.log(
      "LemonSqueezy subscription payment refund recorded successfully:",
      data
    );
  } catch (error) {
    console.error(
      "Error in handleLemonSqueezySubscriptionPaymentRefunded:",
      error
    );
    throw error;
  }
}

async function handleLemonSqueezySubscriptionPlanChanged(
  supabase: any,
  subscriptionData: any
) {
  console.log(
    "Processing LemonSqueezy subscription plan changed:",
    subscriptionData.id
  );

  try {
    const subscription = subscriptionData.attributes;

    const updateData = {
      plan_id: subscription.variant_id?.toString(),
      plan_name: subscription.variant_name || subscription.product_name,
      metadata: {
        ...subscription,
        provider: "lemonsqueezy",
        plan_changed_at: new Date().toISOString(),
      },
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("subscriptions")
      .update(updateData)
      .eq("subscription_id", subscriptionData.id);

    if (error) {
      console.error("Error updating subscription plan change:", error);
      throw error;
    }

    console.log(
      "LemonSqueezy subscription plan change recorded successfully:",
      data
    );
  } catch (error) {
    console.error("Error in handleLemonSqueezySubscriptionPlanChanged:", error);
    throw error;
  }
}

async function handleLemonSqueezyLicenseKeyCreated(
  supabase: any,
  licenseData: any
) {
  console.log("Processing LemonSqueezy license key created:", licenseData.id);

  try {
    const license = licenseData.attributes;

    // Store license key creation event
    const licenseRecord = {
      license_key_id: licenseData.id,
      license_key: license.key,
      status: license.status,
      activation_limit: license.activation_limit,
      activations: license.activations,
      expires_at: license.expires_at,
      customer_email: license.user_email,
      order_id: license.order_id,
      product_id: license.product_id,
      provider: "lemonsqueezy",
      metadata: {
        ...license,
        event_type: "license_key_created",
      },
      created_at: license.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Log to payments table for tracking
    const { data, error } = await supabase.from("payments").insert({
      payment_method: "license_key",
      status: "license_created",
      provider: "lemonsqueezy",
      customer_email: license.user_email,
      order_id: license.order_id?.toString(),
      product_id: license.product_id,
      metadata: licenseRecord,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error recording license key creation:", error);
      throw error;
    }

    console.log(
      "LemonSqueezy license key creation recorded successfully:",
      data
    );
  } catch (error) {
    console.error("Error in handleLemonSqueezyLicenseKeyCreated:", error);
    throw error;
  }
}

async function handleLemonSqueezyLicenseKeyUpdated(
  supabase: any,
  licenseData: any
) {
  console.log("Processing LemonSqueezy license key updated:", licenseData.id);

  try {
    const license = licenseData.attributes;

    // Store license key update event
    const licenseRecord = {
      license_key_id: licenseData.id,
      license_key: license.key,
      status: license.status,
      activation_limit: license.activation_limit,
      activations: license.activations,
      expires_at: license.expires_at,
      customer_email: license.user_email,
      order_id: license.order_id,
      product_id: license.product_id,
      provider: "lemonsqueezy",
      metadata: {
        ...license,
        event_type: "license_key_updated",
      },
      updated_at: new Date().toISOString(),
    };

    // Update existing license record or create new one
    const { data, error } = await supabase.from("payments").upsert(
      {
        payment_method: "license_key",
        status: "license_updated",
        provider: "lemonsqueezy",
        customer_email: license.user_email,
        order_id: license.order_id?.toString(),
        product_id: license.product_id,
        metadata: licenseRecord,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "order_id",
        ignoreDuplicates: false,
      }
    );

    if (error) {
      console.error("Error recording license key update:", error);
      throw error;
    }

    console.log("LemonSqueezy license key update recorded successfully:", data);
  } catch (error) {
    console.error("Error in handleLemonSqueezyLicenseKeyUpdated:", error);
    throw error;
  }
}
