import crypto from "crypto";

export function generateNonce(length = 32): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let nonce = "";
  for (let i = 0; i < length; i++) {
    nonce += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return nonce;
}

export function generateSignature(
  timestamp: string,
  nonce: string,
  body: string,
  secretKey: string
): string {
  const payload = `${timestamp}\n${nonce}\n${body}\n`;
  return crypto
    .createHmac("sha512", secretKey)
    .update(payload)
    .digest("hex")
    .toUpperCase();
}

export interface BinanceOrderParams {
  merchantTradeNo: string;
  orderAmount: number;
  currency: string;
  description: string;
  webhookUrl?: string;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface BinanceOrderResponse {
  status: "SUCCESS" | "FAIL";
  code: string;
  data?: {
    prepayId: string;
    terminalType: string;
    expireTime: number;
    qrcodeLink: string;
    qrContent: string;
    checkoutUrl: string;
  };
  errorMessage?: string;
}

export interface BinanceQueryResponse {
  status: "SUCCESS" | "FAIL";
  code: string;
  data?: {
    merchantId: number;
    prepayId: string;
    merchantTradeNo: string;
    status: "INITIAL" | "PENDING" | "PAID" | "CANCELED" | "ERROR" | "REFUNDING" | "REFUNDED";
    currency: string;
    orderAmount: string;
    transactTime: number;
  };
  errorMessage?: string;
}

export async function createBinanceOrder(params: BinanceOrderParams): Promise<BinanceOrderResponse> {
  const apiKey = process.env.BINANCE_PAY_API_KEY;
  const secretKey = process.env.BINANCE_PAY_SECRET_KEY;
  const baseUrl = process.env.BINANCE_PAY_BASE_URL || "https://bpay.binanceapi.com";

  if (!apiKey || !secretKey) {
    throw new Error("Missing Binance Pay API credentials in environment variables");
  }

  const endpoint = "/binancepay/openapi/v3/order";
  const url = `${baseUrl}${endpoint}`;

  const bodyObj: Record<string, unknown> = {
    env: {
      terminalType: "WEB",
    },
    merchantTradeNo: params.merchantTradeNo,
    orderAmount: Number(params.orderAmount),
    currency: params.currency,
    description: params.description.substring(0, 120),
    goodsDetails: [
      {
        goodsType: "02",
        goodsCategory: "Z000",
        referenceGoodsId: "deposit",
        goodsName: "Deposit",
        goodsDetail: "Crypto deposit to account",
      },
    ],
  };

  if (params.webhookUrl) bodyObj.webhookUrl = params.webhookUrl;
  if (params.returnUrl) bodyObj.returnUrl = params.returnUrl;
  if (params.cancelUrl) bodyObj.cancelUrl = params.cancelUrl;

  const bodyStr = JSON.stringify(bodyObj);
  const timestamp = Date.now().toString();
  const nonce = generateNonce(32);
  const signature = generateSignature(timestamp, nonce, bodyStr, secretKey);

  const response = await fetch(url, {
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

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Binance Pay Create Order API failed with status ${response.status}: ${errorText}`);
  }

  return response.json();
}

export async function queryBinanceOrder(
  query: { merchantTradeNo?: string; prepayId?: string }
): Promise<BinanceQueryResponse> {
  const apiKey = process.env.BINANCE_PAY_API_KEY;
  const secretKey = process.env.BINANCE_PAY_SECRET_KEY;
  const baseUrl = process.env.BINANCE_PAY_BASE_URL || "https://bpay.binanceapi.com";

  if (!apiKey || !secretKey) {
    throw new Error("Missing Binance Pay API credentials in environment variables");
  }

  const endpoint = "/binancepay/openapi/v2/order/query";
  const url = `${baseUrl}${endpoint}`;

  const bodyObj: Record<string, string> = {};
  if (query.merchantTradeNo) {
    bodyObj.merchantTradeNo = query.merchantTradeNo;
  }
  if (query.prepayId) {
    bodyObj.prepayId = query.prepayId;
  }

  if (Object.keys(bodyObj).length === 0) {
    throw new Error("Either merchantTradeNo or prepayId must be provided to query an order");
  }

  const bodyStr = JSON.stringify(bodyObj);
  const timestamp = Date.now().toString();
  const nonce = generateNonce(32);
  const signature = generateSignature(timestamp, nonce, bodyStr, secretKey);

  const response = await fetch(url, {
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

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Binance Pay Query Order API failed with status ${response.status}: ${errorText}`);
  }

  return response.json();
}

export async function queryBinanceCertificates(): Promise<{
  status: "SUCCESS" | "FAIL";
  code: string;
  data?: Array<{ certSerial: string; certPublic: string }>;
  errorMessage?: string;
}> {
  const apiKey = process.env.BINANCE_PAY_API_KEY;
  const secretKey = process.env.BINANCE_PAY_SECRET_KEY;
  const baseUrl = process.env.BINANCE_PAY_BASE_URL || "https://bpay.binanceapi.com";

  if (!apiKey || !secretKey) {
    throw new Error("Missing Binance Pay API credentials in environment variables");
  }

  const endpoint = "/binancepay/openapi/certificates";
  const url = `${baseUrl}${endpoint}`;

  const bodyStr = "{}";
  const timestamp = Date.now().toString();
  const nonce = generateNonce(32);
  const signature = generateSignature(timestamp, nonce, bodyStr, secretKey);

  const response = await fetch(url, {
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

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Binance Pay Certificates API failed with status ${response.status}: ${errorText}`);
  }

  return response.json();
}

export async function verifyWebhookSignature(
  timestamp: string,
  nonce: string,
  bodyStr: string,
  signature: string,
  certSerial: string
): Promise<boolean> {
  try {
    const certsRes = await queryBinanceCertificates();
    if (certsRes.status !== "SUCCESS" || !certsRes.data) {
      console.error("Failed to fetch Binance Pay certificates for webhook verification");
      return false;
    }

    const cert = certsRes.data.find((c) => c.certSerial === certSerial);
    if (!cert) {
      console.error(`Certificate with SN ${certSerial} not found for webhook verification`);
      return false;
    }

    const payload = `${timestamp}\n${nonce}\n${bodyStr}\n`;
    const verify = crypto.createVerify("SHA256");
    verify.update(payload);

    return verify.verify(cert.certPublic, Buffer.from(signature, "base64"));
  } catch (error) {
    console.error("Error verifying webhook signature:", error);
    return false;
  }
}

