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
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const binanceApiKey = Deno.env.get("BINANCE_PAY_API_KEY");
    const binanceSecretKey = Deno.env.get("BINANCE_PAY_SECRET_KEY");
    const binanceBaseUrl = Deno.env.get("BINANCE_PAY_BASE_URL") || "https://bpay.binanceapi.com";

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey || !binanceApiKey || !binanceSecretKey) {
      throw new Error("Missing server environment configuration");
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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

    const { merchantTradeNo } = await req.json();

    if (!merchantTradeNo) {
      return new Response(JSON.stringify({ error: "merchantTradeNo is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify ownership of the order before calling external APIs
    const { data: order, error: fetchError } = await supabaseClient
      .from("payment_orders")
      .select("status, amount, currency")
      .eq("merchant_trade_no", merchantTradeNo)
      .single();

    if (fetchError || !order) {
      return new Response(JSON.stringify({ error: "Order not found or access denied" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (order.status === "PAID") {
      return new Response(JSON.stringify({ status: "PAID", message: "Order already paid and processed" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Query Binance Pay API for status
    const endpoint = "/binancepay/openapi/v2/order/query";
    const bodyObj = { merchantTradeNo };
    const bodyStr = JSON.stringify(bodyObj);
    const timestamp = Date.now().toString();
    const nonce = generateNonce(32);
    const signature = await generateSignature(timestamp, nonce, bodyStr, binanceSecretKey);

    const binanceRes = await fetch(`${binanceBaseUrl}${endpoint}`, {
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
      throw new Error(`Binance Pay Query Order API failed: ${errorText}`);
    }

    const binanceData = await binanceRes.json();

    if (binanceData.status !== "SUCCESS" || !binanceData.data) {
      return new Response(JSON.stringify({ error: binanceData.errorMessage || "Failed to query order from Binance" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const binanceOrderData = binanceData.data;
    const payStatus = binanceOrderData.status; // INITIAL | PENDING | PAID | CANCELED | ERROR | REFUNDING | REFUNDED

    if (payStatus === "PAID") {
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
      
      // Execute database update RPC atomically
      const { data: rpcSuccess, error: rpcError } = await supabaseAdmin.rpc("complete_payment_order", {
        p_merchant_trade_no: merchantTradeNo,
        p_transaction_id: binanceOrderData.prepayId || "QUERY_FALLBACK",
        p_raw_webhook: binanceData,
      });

      if (rpcError || !rpcSuccess) {
        console.error(`Query fallback: Failed to execute complete_payment_order RPC:`, rpcError);
        throw new Error("Failed to process payment completion in database");
      }

      return new Response(JSON.stringify({ status: "PAID" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Map other statuses
    let mappedStatus = "PENDING";
    if (payStatus === "CANCELED") {
      mappedStatus = "CANCELLED";
    } else if (payStatus === "ERROR") {
      mappedStatus = "FAILED";
    }

    // Update status in db if changed
    if (mappedStatus !== order.status) {
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
      await supabaseAdmin
        .from("payment_orders")
        .update({ status: mappedStatus, updated_at: new Date().toISOString() })
        .eq("merchant_trade_no", merchantTradeNo);
    }

    return new Response(JSON.stringify({ status: mappedStatus }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Error querying Binance Pay order status:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
