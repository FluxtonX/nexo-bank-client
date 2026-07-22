import { isSupportedInterval, isSupportedSymbol, SupportedInterval } from "@/config/coins";

const BINANCE_DATA_BASE_URL = "https://data-api.binance.vision";

export type MarketCandle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type MarketTicker24h = {
  symbol: string;
  lastPrice: number;
  priceChange: number;
  priceChangePercent: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  quoteVolume: number;
};

type BinanceKline = [
  number,
  string,
  string,
  string,
  string,
  string,
  number,
  string,
  number,
  string,
  string,
  string,
];

type BinanceTicker24h = {
  symbol: string;
  lastPrice: string;
  priceChange: string;
  priceChangePercent: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
};

function assertSymbol(symbol: string) {
  const normalized = symbol.toUpperCase();
  if (!isSupportedSymbol(normalized)) {
    throw new Error("Unsupported market symbol");
  }
  return normalized;
}

function assertInterval(interval: string): SupportedInterval {
  if (!isSupportedInterval(interval)) {
    throw new Error("Unsupported market interval");
  }
  return interval;
}

function parseNumber(value: string | number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function getCandles(symbol: string, interval: string, limit = 500): Promise<MarketCandle[]> {
  const normalizedSymbol = assertSymbol(symbol);
  const normalizedInterval = assertInterval(interval);
  const safeLimit = Math.min(Math.max(Number(limit) || 500, 1), 1000);
  const url = new URL("/api/v3/uiKlines", BINANCE_DATA_BASE_URL);
  url.searchParams.set("symbol", normalizedSymbol);
  url.searchParams.set("interval", normalizedInterval);
  url.searchParams.set("limit", String(safeLimit));

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Binance candles request failed: ${response.status}`);
  }

  const rows = (await response.json()) as BinanceKline[];
  return rows.map((row) => ({
    time: Math.floor(row[0] / 1000),
    open: parseNumber(row[1]),
    high: parseNumber(row[2]),
    low: parseNumber(row[3]),
    close: parseNumber(row[4]),
    volume: parseNumber(row[5]),
  }));
}

export async function getTicker24h(symbol: string): Promise<MarketTicker24h> {
  const normalizedSymbol = assertSymbol(symbol);
  const url = new URL("/api/v3/ticker/24hr", BINANCE_DATA_BASE_URL);
  url.searchParams.set("symbol", normalizedSymbol);

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Binance ticker request failed: ${response.status}`);
  }

  const ticker = (await response.json()) as BinanceTicker24h;
  return {
    symbol: ticker.symbol,
    lastPrice: parseNumber(ticker.lastPrice),
    priceChange: parseNumber(ticker.priceChange),
    priceChangePercent: parseNumber(ticker.priceChangePercent),
    highPrice: parseNumber(ticker.highPrice),
    lowPrice: parseNumber(ticker.lowPrice),
    volume: parseNumber(ticker.volume),
    quoteVolume: parseNumber(ticker.quoteVolume),
  };
}
