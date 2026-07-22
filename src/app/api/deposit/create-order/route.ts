import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createBinanceOrder } from "@/lib/binancePay";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const { amount, asset } = await req.json();

    if (!amount || !asset) {
      return NextResponse.json({ error: "Amount and Asset are required" }, { status: 400 });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json({ error: "Amount must be a positive number" }, { status: 400 });
    }

    // Generate merchantTradeNo: letters and digits only, max 32 characters
    const merchantTradeNo = crypto.randomUUID().replace(/-/g, "");

    // Get origin from headers to configure return/cancel URLs dynamically
    const origin = req.headers.get("origin") || "http://localhost:3000";
    const returnUrl = `${origin}/deposit/success`;
    const cancelUrl = `${origin}/deposit`;

    // Only send webhookUrl if the origin is a public HTTPS domain (Binance rejects localhost/http)
    const isPublicOrigin = origin.startsWith("https://");
    const webhookUrl = isPublicOrigin ? `${origin}/api/deposit/webhook` : undefined;

    // Create order on Binance Pay
    const binanceRes = await createBinanceOrder({
      merchantTradeNo,
      orderAmount: numericAmount,
      currency: asset.toUpperCase(),
      description: `Deposit ${numericAmount} ${asset} via Binance Pay`,
      ...(webhookUrl && { webhookUrl }),
      returnUrl,
      cancelUrl,
    });

    if (binanceRes.status !== "SUCCESS" || !binanceRes.data) {
      console.error("Binance Pay order creation failed:", binanceRes);
      return NextResponse.json(
        { error: binanceRes.errorMessage || "Failed to create Binance Pay order" },
        { status: 400 }
      );
    }

    // Insert pending request in supabase
    const supabaseAdmin = createAdminClient();
    const { error: dbError } = await supabaseAdmin.from("deposit_requests").insert({
      user_id: user.id,
      asset: asset.toUpperCase(),
      network: "Binance Pay",
      company_address: "BINANCE_PAY",
      expected_amount: numericAmount,
      tx_hash: merchantTradeNo, // Store merchantTradeNo in tx_hash for tracking
      status: "pending",
    });

    if (dbError) {
      console.error("Database error saving deposit request:", dbError);
      return NextResponse.json(
        { error: "Order created, but failed to log deposit request in database" },
        { status: 500 }
      );
    }

    // Insert user notification
    try {
      await supabaseAdmin.from("notifications").insert({
        user_id: user.id,
        audience: "User",
        type: "Info",
        title: "Deposit Request Submitted",
        message: `Your Binance Pay deposit request for ${numericAmount} ${asset} has been submitted and is pending confirmation.`,
        is_read: false,
        link: "/transactions"
      });
    } catch (userNotifErr) {
      console.error("Failed to write user notification:", userNotifErr);
    }

    // Insert admin notification
    try {
      await supabaseAdmin.from("notifications").insert({
        audience: "Admin",
        type: "Info",
        title: "New Deposit Request",
        message: `A user has submitted a new Binance Pay deposit request for ${numericAmount} ${asset}.`,
        is_read: false,
        link: "/dashboard/transactions"
      });
    } catch (notifErr) {
      console.error("Failed to write admin notification:", notifErr);
    }

    try {
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      await supabaseAdmin.from("security_logs").insert({
        action: "Deposit Request Created",
        category: "Transaction",
        severity: "Info",
        user_name: profile?.full_name || user.email || "Unknown User",
        user_id: user.id,
        ip_address: req.headers.get("x-forwarded-for") || "127.0.0.1",
        details: `Created deposit request of ${numericAmount} ${asset} via Binance Pay.`,
        user_agent: req.headers.get("user-agent") || "Unknown"
      });
    } catch (logErr) {
      console.error("Failed to write deposit request log:", logErr);
    }

    return NextResponse.json({
      success: true,
      tradeNo: merchantTradeNo,
      prepayId: binanceRes.data.prepayId,
      qrcodeLink: binanceRes.data.qrcodeLink,
      qrContent: binanceRes.data.qrContent,
      checkoutUrl: binanceRes.data.checkoutUrl,
    });
  } catch (error: any) {
    console.error("Create Binance Order API error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
