"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, TrendingDown, TrendingUp } from "lucide-react";
import { COINS, getCoinBySymbol } from "@/config/coins";
import { LiveCryptoChart } from "@/components/market/LiveCryptoChart";
import { CoinLogo } from "@/components/market/CoinLogo";
import { cn } from "@/lib/utils";

type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type Ticker24h = {
  symbol: string;
  lastPrice: number;
  priceChange: number;
  priceChangePercent: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  quoteVolume: number;
};

export default function ExchangePreviewPage() {
  const searchParams = useSearchParams();
  const requestedSymbol = searchParams.get("symbol")?.toUpperCase() ?? "BTCUSDT";
  const initialCoin = getCoinBySymbol(requestedSymbol) ?? COINS[0];
  const [selectedCoin, setSelectedCoin] = React.useState(initialCoin);
  const [ticker, setTicker] = React.useState<Ticker24h | null>(null);
  const [latestCandle, setLatestCandle] = React.useState<Candle | null>(null);

  React.useEffect(() => {
    const controller = new AbortController();

    async function loadTicker() {
      try {
        const response = await fetch(`/api/market/ticker?symbol=${selectedCoin.symbol}`, {
          signal: controller.signal,
        });
        if (!response.ok) return;
        setTicker((await response.json()) as Ticker24h);
      } catch {
      }
    }

    loadTicker();
    const timer = window.setInterval(loadTicker, 15000);
    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [selectedCoin.symbol]);

  const livePrice = latestCandle?.close ?? ticker?.lastPrice ?? 0;
  const changePercent = ticker?.priceChangePercent ?? 0;

  return (
    <div className="min-h-[calc(100vh-88px)] space-y-4">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div className="flex items-start gap-4">
          <Link
            href="/exchange"
            className="mt-1 grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-[#113285] transition-colors hover:bg-blue-50"
            aria-label="Back to Buy / Sell"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <CoinLogo src={selectedCoin.logoUrl} symbol={selectedCoin.baseAsset} className="h-10 w-10 p-1.5" />
              <div>
                <h1 className="text-2xl font-black tracking-normal text-[#0A0F2C]">{selectedCoin.pairLabel}</h1>
                <p className="mt-1 text-sm font-semibold text-[#718096]">Full Binance chart workspace</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-baseline gap-2">
              <span className="text-3xl font-black text-[#0A0F2C]">{livePrice > 0 ? `$${livePrice.toLocaleString("en-US", { maximumFractionDigits: 2 })}` : "--"}</span>
              <span className={cn("flex items-center gap-1 text-sm font-black", changePercent >= 0 ? "text-emerald-600" : "text-red-500")}>
                {changePercent >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {changePercent >= 0 ? "+" : ""}{changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {COINS.map((coin) => (
            <button
              key={coin.symbol}
              type="button"
              onClick={() => {
                setSelectedCoin(coin);
                setLatestCandle(null);
              }}
              className={cn(
                "rounded-lg px-3 py-2 text-xs font-black transition-colors",
                selectedCoin.symbol === coin.symbol ? "bg-[#113285] text-white" : "bg-white text-slate-600 hover:bg-slate-100",
              )}
            >
              <CoinLogo src={coin.logoUrl} symbol={coin.baseAsset} className="h-5 w-5 p-0.5" />
              {coin.baseAsset}
            </button>
          ))}
        </div>
      </div>

      <section className="rounded-[28px] border border-slate-200 bg-white p-3 shadow-sm md:p-6">
        <LiveCryptoChart
          symbol={selectedCoin.symbol}
          defaultInterval="1h"
          previewMode
          onLatestCandleChange={setLatestCandle}
        />
      </section>
    </div>
  );
}
