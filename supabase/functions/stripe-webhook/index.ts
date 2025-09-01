import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import {
  verifyStripeSignature,
  verifyLemonSqueezySignature,
} from "../_shared/webhook-verification.ts";

console.log("Payment webhook handler loaded (Stripe & LemonSqueezy)");

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

async function updateUserPaymentStatus(supabase: any, update: PaymentStatusUpdate) {
  try {
    console.log(`Updating payment status for user ${update.userId}`);
    
    const { data, error } = await supabase.rpc('update_user_payment_status', {
      user_uuid: update.userId,
      tier: update.tier || 'pro',
      provider: update.provider,
      amount: update.amount,
      currency: update.currency,
      status: update.status,
      expiry_type_param: update.expiryType || 'never'
    });

    if (error) {
      console.error('Error updating user payment status:', error);
      throw error;
    }

    console.log(`User payment status updated successfully for user ${update.userId}`);
    return data;
  } catch (error) {
    console.error('Failed to update user payment status:', error);
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
    const stripeSignature = req.headers.get("stripe-signature");
    const lemonSignature = req.headers.get("x-signature");

    const stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const lemonWebhookSecret = Deno.env.get("LEMONSQUEEZY_WEBHOOK_SECRET");

    let isValidSignature = false;
    let webhookProvider = "unknown";

    // Determine webhook provider and verify signature
    if (stripeSignature && stripeWebhookSecret) {
      isValidSignature = await verifyStripeSignature(
        body,
        stripeSignature,
        stripeWebhookSecret
      );
      webhookProvider = "stripe";
    } else if (lemonSignature && lemonWebhookSecret) {
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
      `Processing ${webhookProvider} webhook event: ${
        event.type || event.meta?.event_name
      }`
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

    // Handle different event types based on provider
    if (webhookProvider === "stripe") {
      switch (event.type) {
        case "checkout.session.completed":
          await handleCheckoutSessionCompleted(
            supabaseClient,
            event.data.object
          );
          break;

        case "payment_intent.succeeded":
          await handlePaymentIntentSucceeded(supabaseClient, event.data.object);
          break;

        case "payment_intent.payment_failed":
          await handlePaymentIntentFailed(supabaseClient, event.data.object);
          break;

        case "customer.subscription.created":
          await handleSubscriptionCreated(supabaseClient, event.data.object);
          break;

        case "customer.subscription.updated":
          await handleSubscriptionUpdated(supabaseClient, event.data.object);
          break;

        case "customer.subscription.deleted":
          await handleSubscriptionDeleted(supabaseClient, event.data.object);
          break;

        case "invoice.payment_succeeded":
          await handleInvoicePaymentSucceeded(
            supabaseClient,
            event.data.object
          );
          break;

        case "invoice.payment_failed":
          await handleInvoicePaymentFailed(supabaseClient, event.data.object);
          break;

        default:
          console.log(`Unhandled Stripe event type: ${event.type}`);
      }
    } else if (webhookProvider === "lemonsqueezy") {
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

// Handler functions for different Stripe events

async function handleCheckoutSessionCompleted(supabase: any, session: any) {
  console.log("Processing checkout session completed:", session.id);

  try {
    // Update payment status in database
    const { data, error } = await supabase
      .from("payments")
      .update({
        status: "completed",
        payment_intent_id: session.payment_intent,
        stripe_customer_id: session.customer,
        customer_email: session.customer_details?.email,
        provider: "stripe",
        metadata: session.metadata || {},
        updated_at: new Date().toISOString(),
      })
      .eq("session_id", session.id);

    if (error) {
      console.error("Error updating payment:", error);
      throw error;
    }

    // Update user payment status in profile if we have user_id
    const userId = session.metadata?.user_id;
    if (userId) {
      await updateUserPaymentStatus(supabase, {
        userId,
        provider: "stripe",
        amount: session.amount_total / 100, // Convert from cents
        currency: session.currency,
        status: "completed",
        expiryType: "never" // Assuming one-time payment for now
      });
    }

    console.log("Payment updated successfully:", data);
  } catch (error) {
    console.error("Error in handleCheckoutSessionCompleted:", error);
    throw error;
  }
}

async function handlePaymentIntentSucceeded(supabase: any, paymentIntent: any) {
  console.log("Processing payment intent succeeded:", paymentIntent.id);

  try {
    // First, try to find if there's an existing payment record
    const { data: existingPayment, error: selectError } = await supabase
      .from("payments")
      .select("*")
      .eq("payment_intent_id", paymentIntent.id)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      // PGRST116 = no rows returned
      console.error("Error checking existing payment:", selectError);
      throw selectError;
    }

    if (existingPayment) {
      // Update existing payment record
      const { data, error } = await supabase
        .from("payments")
        .update({
          status: "completed",
          provider: "stripe",
          updated_at: new Date().toISOString(),
        })
        .eq("payment_intent_id", paymentIntent.id);

      if (error) {
        console.error("Error updating payment intent:", error);
        throw error;
      }

      console.log("Payment intent updated successfully:", data);
    } else {
      // Create new payment record for standalone payment intents
      console.log(
        "No existing payment record found, creating new payment record"
      );

      // Extract user_id from metadata if available
      const userId = paymentIntent.metadata?.userId;

      // If no user_id in metadata, we can't create a record without knowing which user this belongs to
      if (!userId) {
        console.error(
          "No user_id found in payment intent metadata - cannot create payment record"
        );
        console.log("Payment intent metadata:", paymentIntent.metadata);
        return; // Don't throw error, just log and return
      }

      const paymentData = {
        user_id: userId,
        amount: paymentIntent.amount / 100, // Convert from cents
        currency: paymentIntent.currency,
        status: "completed",
        payment_intent_id: paymentIntent.id,
        payment_method: paymentIntent.payment_method_types?.[0] || "card",
        customer_email: paymentIntent.receipt_email,
        stripe_customer_id: paymentIntent.customer,
        provider: "stripe",
        metadata: paymentIntent.metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("payments")
        .insert(paymentData);

      if (error) {
        console.error("Error creating payment record:", error);
        throw error;
      }

      console.log("Payment record created successfully:", data);

      // Update user payment status in profile
      await updateUserPaymentStatus(supabase, {
        userId,
        provider: "stripe",
        amount: paymentIntent.amount / 100, // Convert from cents
        currency: paymentIntent.currency,
        status: "completed",
        expiryType: "never" // Assuming one-time payment
      });
    }
  } catch (error) {
    console.error("Error in handlePaymentIntentSucceeded:", error);
    throw error;
  }
}

async function handlePaymentIntentFailed(supabase: any, paymentIntent: any) {
  console.log("Processing payment intent failed:", paymentIntent.id);

  try {
    // First, try to find if there's an existing payment record
    const { data: existingPayment, error: selectError } = await supabase
      .from("payments")
      .select("*")
      .eq("payment_intent_id", paymentIntent.id)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      // PGRST116 = no rows returned
      console.error("Error checking existing payment:", selectError);
      throw selectError;
    }

    if (existingPayment) {
      // Update existing payment record to failed
      const { data, error } = await supabase
        .from("payments")
        .update({
          status: "failed",
          provider: "stripe",
          updated_at: new Date().toISOString(),
        })
        .eq("payment_intent_id", paymentIntent.id);

      if (error) {
        console.error("Error updating failed payment:", error);
        throw error;
      }

      console.log("Failed payment updated successfully:", data);
    } else {
      // Create new failed payment record
      console.log(
        "No existing payment record found, creating failed payment record"
      );

      const userId = paymentIntent.metadata?.user_id;

      if (!userId) {
        console.error(
          "No user_id found in payment intent metadata - cannot create failed payment record"
        );
        console.log("Payment intent metadata:", paymentIntent.metadata);
        return;
      }

      const paymentData = {
        user_id: userId,
        amount: paymentIntent.amount / 100, // Convert from cents
        currency: paymentIntent.currency,
        status: "failed",
        payment_intent_id: paymentIntent.id,
        payment_method: paymentIntent.payment_method_types?.[0] || "card",
        customer_email: paymentIntent.receipt_email,
        stripe_customer_id: paymentIntent.customer,
        provider: "stripe",
        metadata: paymentIntent.metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("payments")
        .insert(paymentData);

      if (error) {
        console.error("Error creating failed payment record:", error);
        throw error;
      }

      console.log("Failed payment record created successfully:", data);
    }
  } catch (error) {
    console.error("Error in handlePaymentIntentFailed:", error);
    throw error;
  }
}

async function handleSubscriptionCreated(supabase: any, subscription: any) {
  console.log("Processing subscription created:", subscription.id);

  try {
    // Extract user ID from metadata or customer email
    const userId = subscription.metadata?.user_id;
    if (!userId) {
      console.error("No user_id found in subscription metadata");
      return;
    }

    const subscriptionData = {
      user_id: userId,
      subscription_id: subscription.id,
      customer_id: subscription.customer,
      status: subscription.status,
      plan_id: subscription.items.data[0]?.plan?.id,
      plan_name:
        subscription.items.data[0]?.plan?.nickname ||
        subscription.items.data[0]?.plan?.name,
      current_period_start: new Date(
        subscription.current_period_start * 1000
      ).toISOString(),
      current_period_end: new Date(
        subscription.current_period_end * 1000
      ).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end || false,
      trial_start: subscription.trial_start
        ? new Date(subscription.trial_start * 1000).toISOString()
        : null,
      trial_end: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
      metadata: subscription.metadata || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("subscriptions")
      .upsert(subscriptionData, {
        onConflict: "subscription_id",
        ignoreDuplicates: false,
      });

    if (error) {
      console.error("Error creating subscription:", error);
      throw error;
    }

    console.log("Subscription created successfully:", data);
  } catch (error) {
    console.error("Error in handleSubscriptionCreated:", error);
    throw error;
  }
}

async function handleSubscriptionUpdated(supabase: any, subscription: any) {
  console.log("Processing subscription updated:", subscription.id);

  try {
    const updateData = {
      status: subscription.status,
      plan_id: subscription.items.data[0]?.plan?.id,
      plan_name:
        subscription.items.data[0]?.plan?.nickname ||
        subscription.items.data[0]?.plan?.name,
      current_period_start: new Date(
        subscription.current_period_start * 1000
      ).toISOString(),
      current_period_end: new Date(
        subscription.current_period_end * 1000
      ).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end || false,
      canceled_at: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000).toISOString()
        : null,
      ended_at: subscription.ended_at
        ? new Date(subscription.ended_at * 1000).toISOString()
        : null,
      metadata: subscription.metadata || {},
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("subscriptions")
      .update(updateData)
      .eq("subscription_id", subscription.id);

    if (error) {
      console.error("Error updating subscription:", error);
      throw error;
    }

    console.log("Subscription updated successfully:", data);
  } catch (error) {
    console.error("Error in handleSubscriptionUpdated:", error);
    throw error;
  }
}

async function handleSubscriptionDeleted(supabase: any, subscription: any) {
  console.log("Processing subscription deleted:", subscription.id);

  try {
    const updateData = {
      status: "canceled",
      ended_at: new Date(subscription.ended_at * 1000).toISOString(),
      canceled_at: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000).toISOString()
        : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("subscriptions")
      .update(updateData)
      .eq("subscription_id", subscription.id);

    if (error) {
      console.error("Error updating deleted subscription:", error);
      throw error;
    }

    console.log("Subscription deleted successfully:", data);
  } catch (error) {
    console.error("Error in handleSubscriptionDeleted:", error);
    throw error;
  }
}

async function handleInvoicePaymentSucceeded(supabase: any, invoice: any) {
  console.log("Processing invoice payment succeeded:", invoice.id);

  try {
    // Create a new payment record for successful invoice payment
    const paymentData = {
      user_id: invoice.metadata?.user_id,
      plan_id: invoice.lines.data[0]?.plan?.id,
      plan_name:
        invoice.lines.data[0]?.plan?.nickname ||
        invoice.lines.data[0]?.plan?.name,
      amount: invoice.amount_paid / 100, // Convert from cents
      currency: invoice.currency,
      status: "completed",
      payment_intent_id: invoice.payment_intent,
      payment_method: "subscription",
      customer_email: invoice.customer_email,
      stripe_customer_id: invoice.customer,
      provider: "stripe",
      metadata: invoice.metadata || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from("payments").insert(paymentData);

    if (error) {
      console.error("Error creating invoice payment:", error);
      throw error;
    }

    console.log("Invoice payment recorded successfully:", data);
  } catch (error) {
    console.error("Error in handleInvoicePaymentSucceeded:", error);
    throw error;
  }
}

async function handleInvoicePaymentFailed(supabase: any, invoice: any) {
  console.log("Processing invoice payment failed:", invoice.id);

  try {
    // Create a failed payment record
    const paymentData = {
      user_id: invoice.metadata?.user_id,
      plan_id: invoice.lines.data[0]?.plan?.id,
      plan_name:
        invoice.lines.data[0]?.plan?.nickname ||
        invoice.lines.data[0]?.plan?.name,
      amount: invoice.amount_due / 100, // Convert from cents
      currency: invoice.currency,
      status: "failed",
      payment_method: "subscription",
      customer_email: invoice.customer_email,
      stripe_customer_id: invoice.customer,
      provider: "stripe",
      metadata: invoice.metadata || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from("payments").insert(paymentData);

    if (error) {
      console.error("Error creating failed invoice payment:", error);
      throw error;
    }

    console.log("Failed invoice payment recorded successfully:", data);
  } catch (error) {
    console.error("Error in handleInvoicePaymentFailed:", error);
    throw error;
  }
}

// LemonSqueezy webhook handlers

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

    // Store in lemon_orders table
    const lemonOrderData = {
      user_id: userId, // Can be null
      order_id: orderData.id,
      order_number: order.order_number,
      identifier: order.identifier,
      store_id: order.store_id,
      customer_id: order.customer_id,
      status: order.status,
      currency: order.currency,
      total: order.total / 100, // Convert from cents
      subtotal: order.subtotal / 100,
      tax: order.tax / 100,
      tax_rate: order.tax_rate,
      tax_name: order.tax_name,
      tax_inclusive: order.tax_inclusive,
      discount_total: order.discount_total / 100,
      setup_fee: order.setup_fee / 100,
      refunded: order.refunded,
      refunded_amount: order.refunded_amount / 100,
      refunded_at: order.refunded_at,
      test_mode: order.test_mode,
      currency_rate: parseFloat(order.currency_rate),
      user_name: order.user_name,
      user_email: order.user_email,
      total_formatted: order.total_formatted,
      subtotal_formatted: order.subtotal_formatted,
      tax_formatted: order.tax_formatted,
      discount_formatted: order.discount_total_formatted,
      setup_fee_formatted: order.setup_fee_formatted,
      refunded_amount_formatted: order.refunded_amount_formatted,
      receipt_url: order.urls?.receipt,
      first_order_item: firstOrderItem,
      relationships: orderData.relationships,
      metadata: order.metadata || {},
      created_at: order.created_at,
      updated_at: order.updated_at,
    };

    const { data: lemonOrder, error: lemonError } = await supabase
      .from("lemon_orders")
      .insert(lemonOrderData);

    if (lemonError) {
      console.error("Error creating LemonSqueezy order:", lemonError);
      throw lemonError;
    }

    // Also store in payments table for unified payment tracking
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

    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert(paymentData);

    if (paymentError) {
      console.error("Error creating payment record:", paymentError);
      throw paymentError;
    }

    console.log("LemonSqueezy order processed successfully:", {
      lemonOrder,
      payment,
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
        expiryType: "never" // Assuming one-time payment
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

    // Update lemon_orders table
    const { error: lemonError } = await supabase
      .from("lemon_orders")
      .update({
        refunded: true,
        refunded_amount: order.refunded_amount / 100,
        refunded_at: order.refunded_at || new Date().toISOString(),
        refunded_amount_formatted: order.refunded_amount_formatted,
        updated_at: new Date().toISOString(),
      })
      .eq("order_id", orderData.id);

    if (lemonError) {
      console.error("Error updating LemonSqueezy order refund:", lemonError);
      throw lemonError;
    }

    // Update payments table
    const { error: paymentError } = await supabase
      .from("payments")
      .update({
        status: "refunded",
        refunded: true,
        refunded_amount: order.refunded_amount / 100,
        refunded_at: order.refunded_at || new Date().toISOString(),
        refunded_amount_formatted: order.refunded_amount_formatted,
        updated_at: new Date().toISOString(),
      })
      .eq("order_id", orderData.id);

    if (paymentError) {
      console.error("Error updating payment refund:", paymentError);
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
      .insert(subscriptionRecord);

    if (error) {
      console.error("Error creating LemonSqueezy subscription:", error);
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
      .update(updateData)
      .eq("subscription_id", subscriptionData.id);

    if (error) {
      console.error("Error updating LemonSqueezy subscription:", error);
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
      .update(updateData)
      .eq("subscription_id", subscriptionData.id);

    if (error) {
      console.error("Error cancelling LemonSqueezy subscription:", error);
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
