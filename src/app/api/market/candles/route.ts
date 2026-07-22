import { NextRequest, NextResponse } from "next/server";
import { isSupportedInterval, isSupportedSymbol } from "@/config/coins";
import { getCandles } from "@/lib/market/binance";

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol")?.toUpperCase() ?? "";
  const interval = request.nextUrl.searchParams.get("interval") ?? "";

  if (!isSupportedSymbol(symbol)) {
    return NextResponse.json({ error: "Unsupported symbol" }, { status: 400 });
  }

  if (!isSupportedInterval(interval)) {
    return NextResponse.json({ error: "Unsupported interval" }, { status: 400 });
  }

  try {
    const candles = await getCandles(symbol, interval, 500);
    return NextResponse.json({ candles });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load candles";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
