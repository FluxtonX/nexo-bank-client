import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function generateNonce(length = 32): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let nonce = "";
  for (let i = 0; i < length; i++) {
    nonce += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return nonce;
}

async function generateHmacSignature(
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

async function queryBinanceCertificates(baseUrl: string, apiKey: string, secretKey: string) {
  const url = `${baseUrl}/binancepay/openapi/certificates`;
  const bodyStr = "{}";
  const timestamp = Date.now().toString();
  const nonce = generateNonce(32);
  const signature = await generateHmacSignature(timestamp, nonce, bodyStr, secretKey);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "BinancePay-Timestamp": timestamp,
      "BinancePay-Nonce": nonce,
      "BinancePay-Certificate-SN": apiKey,
      "BinancePay-Signature": signature,
    },
    body: bodyStr,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch certificates: ${await res.text()}`);
  }

  return res.json();
}

async function verifyWebhookSignature(
  timestamp: string,
  nonce: string,
  bodyStr: string,
  signature: string,
  certSerial: string,
  baseUrl: string,
  apiKey: string,
  secretKey: string
): Promise<boolean> {
  try {
    const certsRes = await queryBinanceCertificates(baseUrl, apiKey, secretKey);
    if (certsRes.status !== "SUCCESS" || !certsRes.data) {
      console.error("Failed to fetch certificates");
      return false;
    }

    const cert = certsRes.data.find((c: any) => c.certSerial === certSerial);
    if (!cert) {
      console.error(`Certificate with SN ${certSerial} not found`);
      return false;
    }

    const cleanPem = cert.certPublic
      .replace(/-----BEGIN PUBLIC KEY-----/, "")
      .replace(/-----END PUBLIC KEY-----/, "")
      .replace(/\s+/g, "");

    const binaryDerString = atob(cleanPem);
    const rawKey = new Uint8Array(binaryDerString.length);
    for (let i = 0; i < binaryDerString.length; i++) {
      rawKey[i] = binaryDerString.charCodeAt(i);
    }

    const cryptoKey = await crypto.subtle.importKey(
      "spki",
      rawKey,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const payload = `${timestamp}\n${nonce}\n${bodyStr}\n`;

    const binarySigString = atob(signature);
    const sigBytes = new Uint8Array(binarySigString.length);
    for (let i = 0; i < binarySigString.length; i++) {
      sigBytes[i] = binarySigString.charCodeAt(i);
    }

    return await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      cryptoKey,
      sigBytes,
      new TextEncoder().encode(payload)
    );
  } catch (error) {
    console.error("Error verifying webhook signature:", error);
    return false;
  }
}

serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const binanceApiKey = Deno.env.get("BINANCE_PAY_API_KEY");
    const binanceSecretKey = Deno.env.get("BINANCE_PAY_SECRET_KEY");
    const binanceBaseUrl = Deno.env.get("BINANCE_PAY_BASE_URL") || "https://bpay.binanceapi.com";

    if (!supabaseUrl || !supabaseServiceKey || !binanceApiKey || !binanceSecretKey) {
      throw new Error("Missing server environment configuration");
    }

    const timestamp = req.headers.get("BinancePay-Timestamp");
    const nonce = req.headers.get("BinancePay-Nonce");
    const signature = req.headers.get("BinancePay-Signature");
    const certSerial = req.headers.get("BinancePay-Certificate-SN");

    const bodyStr = await req.text();

    if (!timestamp || !nonce || !signature || !certSerial) {
      console.warn("Binance Pay Webhook: Missing required headers");
      return new Response(JSON.stringify({ returnCode: "FAIL", returnMessage: "Missing required headers" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify signature
    const isValid = await verifyWebhookSignature(
      timestamp,
      nonce,
      bodyStr,
      signature,
      certSerial,
      binanceBaseUrl,
      binanceApiKey,
      binanceSecretKey
    );

    if (!isValid) {
      console.warn("Binance Pay Webhook: Signature verification failed");
      return new Response(JSON.stringify({ returnCode: "FAIL", returnMessage: "Invalid signature" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const payload = JSON.parse(bodyStr);
    const { bizType, bizStatus, data } = payload;

    if (bizType === "PAY" && bizStatus === "PAY_SUCCESS" && data) {
      const { merchantTradeNo, transactionId } = data;
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

      // Verify that the order exists, match amount/currency, and check status is PENDING
      const { data: dbOrder, error: fetchError } = await supabaseAdmin
        .from("payment_orders")
        .select("amount, currency, status")
        .eq("merchant_trade_no", merchantTradeNo)
        .single();

      if (fetchError || !dbOrder) {
        console.error(`Webhook: Order ${merchantTradeNo} not found in database:`, fetchError);
        return new Response(JSON.stringify({ returnCode: "FAIL", returnMessage: "Order not found" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (dbOrder.status === "PAID") {
        // Idempotent: return success if already credited
        return new Response(JSON.stringify({ returnCode: "SUCCESS", returnMessage: null }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Execute atomic transaction via stored procedure (RPC)
      const { data: rpcSuccess, error: rpcError } = await supabaseAdmin.rpc("complete_payment_order", {
        p_merchant_trade_no: merchantTradeNo,
        p_transaction_id: transactionId,
        p_raw_webhook: payload,
      });

      if (rpcError || !rpcSuccess) {
        console.error(`Webhook: Failed to execute complete_payment_order RPC for ${merchantTradeNo}:`, rpcError);
        throw new Error("Failed to process payment completion in database");
      }

      console.log(`Webhook: Successfully completed and credited payment for ${merchantTradeNo}`);
    }

    return new Response(JSON.stringify({ returnCode: "SUCCESS", returnMessage: null }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Binance Pay Webhook error:", error);
    return new Response(JSON.stringify({ returnCode: "FAIL", returnMessage: error.message || "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
