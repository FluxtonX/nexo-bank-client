import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function generateNonce(length = 32): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let nonce = "";
  for (let i = 0; i < length; i++) {
    nonce += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return nonce;
}

async function generateSignature(
  timestamp: string,
  nonce: string,
  body: string,
  secretKey: string
): Promise<string> {
  const payload = `${timestamp}\n${nonce}\n${body}\n`;
  const encoder = new TextEncoder();
  const keyBuf = encoder.encode(secretKey);
  const payloadBuf = encoder.encode(payload);

  const key = await crypto.subtle.importKey(
    "raw",
    keyBuf,
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"]
  );

  const sigBuf = await crypto.subtle.sign("HMAC", key, payloadBuf);
  return Array.from(new Uint8Array(sigBuf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

serve(async (req) => {
  // CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const binanceApiKey = Deno.env.get("BINANCE_PAY_API_KEY");
    const binanceSecretKey = Deno.env.get("BINANCE_PAY_SECRET_KEY");
    const binanceBaseUrl = Deno.env.get("BINANCE_PAY_BASE_URL") || "https://bpay.binanceapi.com";
    const frontendUrl = Deno.env.get("FRONTEND_URL") || "http://localhost:3000";

    if (!supabaseUrl || !supabaseServiceKey || !binanceApiKey || !binanceSecretKey) {
      throw new Error("Missing server environment configuration");
    }

    const payload = await req.json();

    // Check if triggered by a Supabase Database Webhook (Table-driven)
    const isWebhook = payload.record && payload.table === "payment_orders";
    
    let currency: string;
    let amount: number;
    let merchantTradeNo: string;
    let userId: string;
    let orderId: string | null = null;

    if (isWebhook) {
      const record = payload.record;
      currency = record.currency;
      amount = Number(record.amount);
      merchantTradeNo = record.merchant_trade_no;
      userId = record.user_id;
      orderId = record.id;
    } else {
      // Direct API invocation via Supabase client
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        return new Response(JSON.stringify({ error: "Missing authorization header" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
      const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } },
      });

      const {
        data: { user },
        error: authError,
      } = await supabaseClient.auth.getUser();

      if (authError || !user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      currency = payload.currency;
      amount = Number(payload.amount);
      userId = user.id;
      merchantTradeNo = crypto.randomUUID().replace(/-/g, "").substring(0, 32);
    }

    if (!currency || !amount) {
      return new Response(JSON.stringify({ error: "Currency and amount are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return new Response(JSON.stringify({ error: "Amount must be a positive number" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supportedCurrencies = ["USDT", "BTC", "ETH"];
    const selectedCurrency = currency.toUpperCase();
    if (!supportedCurrencies.includes(selectedCurrency)) {
      return new Response(JSON.stringify({ error: "This currency is not currently supported for Binance Pay deposits." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const webhookUrl = `${supabaseUrl}/functions/v1/binance-pay-webhook`;

    // Construct Binance Order Body
    const binanceBody = {
      env: {
        terminalType: "WEB",
      },
      merchantTradeNo: merchantTradeNo,
      orderAmount: numericAmount,
      currency: selectedCurrency,
      supportPayCurrency: selectedCurrency,
      description: "User wallet deposit",
      orderExpireTime: 900000, // 15 minutes
      goodsDetails: [
        {
          goodsType: "02",
          goodsCategory: "Z000",
          referenceGoodsId: "wallet_deposit",
          goodsName: "Wallet Deposit",
          goodsDetail: "User wallet top up via Binance Pay",
        },
      ],
      passThroughInfo: JSON.stringify({
        userId: userId,
        type: "deposit",
        currency: selectedCurrency,
      }),
      webhookUrl: webhookUrl,
      returnUrl: `${frontendUrl}/deposit/success`,
      cancelUrl: `${frontendUrl}/deposit`,
    };

    const bodyStr = JSON.stringify(binanceBody);
    const timestamp = Date.now().toString();
    const nonce = generateNonce(32);
    const signature = await generateSignature(timestamp, nonce, bodyStr, binanceSecretKey);

    const binanceRes = await fetch(`${binanceBaseUrl}/binancepay/openapi/v3/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "BinancePay-Timestamp": timestamp,
        "BinancePay-Nonce": nonce,
        "BinancePay-Certificate-SN": binanceApiKey,
        "BinancePay-Signature": signature,
      },
      body: bodyStr,
    });

    if (!binanceRes.ok) {
      const errorText = await binanceRes.text();
      throw new Error(`Binance Pay Order API failed: ${errorText}`);
    }

    const binanceData = await binanceRes.json();

    if (binanceData.status !== "SUCCESS" || !binanceData.data) {
      return new Response(JSON.stringify({ error: binanceData.errorMessage || "Failed to create Binance Pay order" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const orderData = binanceData.data;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    if (isWebhook && orderId) {
      // If table-driven, update the existing row with the QR content and details
      const { error: dbError } = await supabaseAdmin
        .from("payment_orders")
        .update({
          prepay_id: orderData.prepayId,
          qrcode_link: orderData.qrcodeLink,
          qr_content: orderData.qrContent,
          checkout_url: orderData.checkoutUrl,
          deeplink: orderData.deeplink || "",
          universal_url: orderData.universalUrl || "",
          expire_time: orderData.expireTime,
          raw_response: binanceData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (dbError) {
        console.error("Database error updating payment order:", dbError);
        throw new Error("Failed to update payment order in database");
      }
    } else {
      // Direct API call, insert new row
      const { error: dbError } = await supabaseAdmin.from("payment_orders").insert({
        user_id: userId,
        merchant_trade_no: merchantTradeNo,
        prepay_id: orderData.prepayId,
        currency: selectedCurrency,
        amount: numericAmount,
        status: "PENDING",
        qrcode_link: orderData.qrcodeLink,
        qr_content: orderData.qrContent,
        checkout_url: orderData.checkoutUrl,
        deeplink: orderData.deeplink || "",
        universal_url: orderData.universalUrl || "",
        expire_time: orderData.expireTime,
        raw_response: binanceData,
      });

      if (dbError) {
        console.error("Database error saving payment order:", dbError);
        throw new Error("Failed to store payment order in database");
      }
    }

    return new Response(JSON.stringify({
      merchantTradeNo,
      prepayId: orderData.prepayId,
      qrcodeLink: orderData.qrcodeLink,
      qrContent: orderData.qrContent,
      checkoutUrl: orderData.checkoutUrl,
      deeplink: orderData.deeplink || "",
      universalUrl: orderData.universalUrl || "",
      expireTime: orderData.expireTime,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Error creating Binance Pay order:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
