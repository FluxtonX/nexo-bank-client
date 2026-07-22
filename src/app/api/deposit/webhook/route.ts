import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyWebhookSignature } from "@/lib/binancePay";

export async function POST(req: Request) {
  try {
    const timestamp = req.headers.get("BinancePay-Timestamp");
    const nonce = req.headers.get("BinancePay-Nonce");
    const signature = req.headers.get("BinancePay-Signature");
    const certSerial = req.headers.get("BinancePay-Certificate-SN");

    const bodyStr = await req.text();

    if (!timestamp || !nonce || !signature || !certSerial) {
      console.warn("Binance Pay Webhook: Missing required headers");
      return NextResponse.json({ error: "Missing required headers" }, { status: 400 });
    }

    // Verify webhook signature using the public certificates from Binance Pay
    const isValid = await verifyWebhookSignature(
      timestamp,
      nonce,
      bodyStr,
      signature,
      certSerial
    );

    if (!isValid) {
      console.warn("Binance Pay Webhook: Signature verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(bodyStr);
    const { bizType, bizStatus, data } = payload;

    console.log("Binance Pay Webhook received:", bizType, bizStatus, data);

    // Check if the business status indicates successful payment
    if (bizType === "PAY" && bizStatus === "PAY_SUCCESS" && data) {
      const { merchantTradeNo } = data;
      const supabaseAdmin = createAdminClient();

      // Check current status of the request
      const { data: requestData, error: fetchError } = await supabaseAdmin
        .from("deposit_requests")
        .select("status")
        .eq("tx_hash", merchantTradeNo)
        .single();

      if (fetchError) {
        console.error("Webhook: Error fetching deposit request details:", fetchError);
      } else if (requestData && requestData.status === "pending") {
        const { error: updateError } = await supabaseAdmin
          .from("deposit_requests")
          .update({ status: "approved", reviewed_at: new Date().toISOString() })
          .eq("tx_hash", merchantTradeNo);

        if (updateError) {
          console.error("Webhook: Failed to update deposit request to approved:", updateError);
        } else {
          console.log(`Webhook: Successfully auto-approved deposit request ${merchantTradeNo}`);
        }
      }
    }

    // Acknowledge receipt to Binance Pay as required by the API specification
    return new Response("SUCCESS", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error: any) {
    console.error("Binance Pay Webhook error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
