import { NextRequest, NextResponse } from "next/server";
import { isSupportedSymbol } from "@/config/coins";
import { getTicker24h } from "@/lib/market/binance";

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol")?.toUpperCase() ?? "";

  if (!isSupportedSymbol(symbol)) {
    return NextResponse.json({ error: "Unsupported symbol" }, { status: 400 });
  }

  try {
    const ticker = await getTicker24h(symbol);
    return NextResponse.json(ticker);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load ticker";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
