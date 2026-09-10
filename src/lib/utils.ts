import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validatePasswordRules(password: string) {
  return {
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };
}

// Symbol to CoinGecko ID mapping
export const SYMBOL_TO_COIN_ID: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  USDT: "tether",
  USDC: "usd-coin",
  SOL: "solana",
  BNB: "binancecoin",
  XRP: "ripple",
  DOGE: "dogecoin",
  ADA: "cardano",
  AVAX: "avalanche-2",
  DOT: "polkadot",
  MATIC: "matic-network",
  LINK: "chainlink",
  UNI: "uniswap",
  ATOM: "cosmos",
  LTC: "litecoin",
  BCH: "bitcoin-cash",
  XLM: "stellar",
  ALGO: "algorand",
  VET: "vechain",
  FIL: "filecoin",
  TRX: "tron",
  ETC: "ethereum-classic",
  XMR: "monero",
  EOS: "eos",
  IOTA: "iota",
  NEO: "neo",
  DASH: "dash",
  ZEC: "zcash",
  CAD: "canadian-dollar",
};

// Coin colors for UI
export const COIN_COLORS: Record<string, string> = {
  BTC: "#F7931A",
  ETH: "#627EEA",
  USDT: "#26A17B",
  USDC: "#2775CA",
  SOL: "#00FFA3",
  BNB: "#F3BA2F",
  XRP: "#23292F",
  DOGE: "#C2A633",
  ADA: "#0033AD",
  AVAX: "#E84142",
  DOT: "#E6007A",
  MATIC: "#8247E5",
  LINK: "#2A5ADA",
  UNI: "#FF007A",
  ATOM: "#2E3148",
  LTC: "#345D9D",
  BCH: "#8DC351",
  XLM: "#14B6E7",
  ALGO: "#1B2C4E",
  VET: "#15B8E6",
  FIL: "#0090FF",
  TRX: "#EF0027",
  ETC: "#3CC8D8",
  XMR: "#FF6600",
  EOS: "#000000",
  IOTA: "#131F37",
  NEO: "#00C5D7",
  DASH: "#008DE4",
  ZEC: "#F4B731",
  CAD: "#047857",
};

export function calculateCADBalance(wallets: any[], rates: Record<string, number>) {
  return calculateFiatBalance(wallets, rates, "CAD");
}

export function calculateFiatBalance(wallets: any[], rates: Record<string, number>, fiatCurrency = "CAD") {
  const fiat = fiatCurrency.toUpperCase();
  return wallets.reduce((total: number, w: any) => {
    const curr = w.currency?.toUpperCase();
    if (curr === fiat) {
      return total + Number(w.balance || 0);
    }
    const rate = rates[curr] || rates.USDT || 1;
    return total + (Number(w.balance || 0) * rate);
  }, 0);
}

export function formatCurrencyAmount(amount: number, symbol = "$", code?: string): string {
  const formatted = amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return code ? `${symbol}${formatted} ${code}` : `${symbol}${formatted}`;
}

const cachedRatesByFiat: Record<string, { rates: Record<string, number>; timestamp: number }> = {};

/** Fetch live USDT→CAD rate without hardcoded fallbacks (for order pricing). */
export async function fetchLiveUSDTtoCAD(): Promise<number | null> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=cad",
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.tether?.cad ?? null;
  } catch {
    return null;
  }
}

export async function fetchLiveCADRates(symbols?: string[]): Promise<Record<string, number>> {
  return fetchLiveFiatRates(symbols, "CAD");
}

export async function fetchLiveFiatRates(symbols?: string[], fiatCurrency = "CAD"): Promise<Record<string, number>> {
  const fiat = (fiatCurrency || "CAD").toLowerCase();
  const now = Date.now();
  const cached = cachedRatesByFiat[fiat];
  if (cached && now - cached.timestamp < 60000 && !symbols) {
    return cached.rates;
  }

  try {
    const coinIds = symbols 
      ? symbols.map(s => SYMBOL_TO_COIN_ID[s.toUpperCase()] || s.toLowerCase())
      : Object.values(SYMBOL_TO_COIN_ID).slice(0, 10);
    
    const uniqueIds = [...new Set(coinIds)].join(",");
    
    const coinGeckoRes = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${uniqueIds}&vs_currencies=${fiat}`,
      { cache: "no-store" }
    );
    
    if (!coinGeckoRes.ok) {
      throw new Error(`CoinGecko API failed with status: ${coinGeckoRes.status}`);
    }
    
    const coinGeckoData = await coinGeckoRes.json();

    if (!coinGeckoData || typeof coinGeckoData !== 'object') {
      throw new Error('Invalid data structure from CoinGecko API');
    }

    const rates: Record<string, number> = {};
    
    Object.entries(SYMBOL_TO_COIN_ID).forEach(([symbol, coinId]) => {
      if (coinGeckoData[coinId]?.[fiat]) {
        rates[symbol] = coinGeckoData[coinId][fiat];
      }
    });

    // Baseline multipliers relative to USD to provide solid fallbacks per fiat
    const fiatMultiplier: Record<string, number> = {
      cad: 1.36,
      gbp: 0.78,
      eur: 0.92,
      usd: 1.0,
      sek: 10.4,
      nok: 10.6,
      chf: 0.88,
      aud: 1.52,
      pkr: 278.0,
      inr: 83.5,
      zar: 18.2,
      jpy: 155.0,
      sgd: 1.35,
      aed: 3.67,
    };
    const mult = fiatMultiplier[fiat] || (fiat === "cad" ? 1.36 : 1.0);

    const baseUSDRates: Record<string, number> = {
      BTC: 68000,
      ETH: 2600,
      USDT: 1.0,
      USDC: 1.0,
      SOL: 150,
      BNB: 580,
      XRP: 0.55,
      DOGE: 0.12,
      ADA: 0.40,
    };

    Object.entries(baseUSDRates).forEach(([symbol, usdPrice]) => {
      if (!rates[symbol]) {
        rates[symbol] = Number((usdPrice * mult).toFixed(2));
      }
    });
    rates[fiat.toUpperCase()] = 1;

    cachedRatesByFiat[fiat] = { rates, timestamp: now };
    return rates;
  } catch (error) {
    console.error(`Failed to fetch live ${fiat.toUpperCase()} rates, using defaults`, error);
    if (!cachedRatesByFiat[fiat]) {
      const mult = fiat === "gbp" ? 0.78 : fiat === "eur" ? 0.92 : fiat === "sek" ? 10.4 : fiat === "nok" ? 10.6 : 1.36;
      cachedRatesByFiat[fiat] = {
        rates: {
          BTC: 68000 * mult,
          ETH: 2600 * mult,
          USDT: 1.0 * mult,
          USDC: 1.0 * mult,
          SOL: 150 * mult,
          BNB: 580 * mult,
          XRP: 0.55 * mult,
          [fiat.toUpperCase()]: 1,
        },
        timestamp: now,
      };
    }
    return cachedRatesByFiat[fiat].rates;
  }
}

export const TORONTO_TIMEZONE = "America/Toronto";

export function formatTorontoDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TORONTO_TIMEZONE,
    ...options,
  }).format(d);
}

export function formatTorontoDateTime(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TORONTO_TIMEZONE,
    ...options,
  }).format(d);
}
