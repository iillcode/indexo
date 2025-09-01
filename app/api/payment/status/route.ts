import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
    const { supabase } = createClient(request);

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get user payment information
    const { data: paymentInfo, error: paymentError } = await supabase.rpc(
      "get_user_payment_info",
      {
        user_uuid: user.id,
      }
    );

    if (paymentError) {
      console.error("Error fetching payment info:", paymentError);
      return NextResponse.json(
        { error: "Failed to fetch payment information" },
        { status: 500 }
      );
    }

    const userPaymentInfo = paymentInfo && paymentInfo.length > 0 ? paymentInfo[0] : null;

    // If no payment info found, return default free tier info
    if (!userPaymentInfo) {
      return NextResponse.json({
        user_tier: "free",
        payment_provider: null,
        payment_amount: null,
        payment_currency: null,
        payment_status: "none",
        payment_date: null,
        expiry_date: null,
        expiry_type: "never",
        is_paid_user: false,
        can_make_payment: true,
      });
    }

    return NextResponse.json(userPaymentInfo);
  } catch (error) {
    console.error("Payment status API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { supabase } = createClient(request);

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { tier, provider, amount, currency, status, expiryType } = body;

    // Validate required fields
    if (!tier || !provider || !status) {
      return NextResponse.json(
        { error: "Missing required fields: tier, provider, status" },
        { status: 400 }
      );
    }

    // Update user payment status
    const { data, error } = await supabase.rpc("update_user_payment_status", {
      user_uuid: user.id,
      tier,
      provider,
      amount: amount || null,
      currency: currency || "usd",
      status,
      expiry_type_param: expiryType || "never",
    });

    if (error) {
      console.error("Error updating payment status:", error);
      return NextResponse.json(
        { error: "Failed to update payment status" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, updated: data });
  } catch (error) {
    console.error("Payment status update API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}