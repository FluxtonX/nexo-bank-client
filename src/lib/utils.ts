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
  CAD: "#1650AB",
};

export function calculateCADBalance(wallets: any[], rates: Record<string, number>) {
  return wallets.reduce((total: number, w: any) => {
    const rate = rates[w.currency?.toUpperCase()] || rates.USDT || 1.36;
    return total + (Number(w.balance || 0) * rate);
  }, 0);
}

let cachedRates: Record<string, number> | null = null;
let lastFetchTime = 0;

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
  const now = Date.now();
  if (cachedRates && now - lastFetchTime < 60000 && !symbols) {
    return cachedRates;
  }

  try {
    const coinIds = symbols 
      ? symbols.map(s => SYMBOL_TO_COIN_ID[s.toUpperCase()] || s.toLowerCase())
      : Object.values(SYMBOL_TO_COIN_ID).slice(0, 10);
    
    const uniqueIds = [...new Set(coinIds)].join(",");
    
    const coinGeckoRes = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${uniqueIds}&vs_currencies=cad`
    );
    const coinGeckoData = await coinGeckoRes.json();

    cachedRates = {};
    
    Object.entries(SYMBOL_TO_COIN_ID).forEach(([symbol, coinId]) => {
      if (coinGeckoData[coinId]?.cad) {
        cachedRates![symbol] = coinGeckoData[coinId].cad;
      }
    });

    const defaultRates: Record<string, number> = {
      BTC: 95000,
      ETH: 3500,
      USDT: 1.36,
      USDC: 1.36,
      SOL: 150,
      BNB: 600,
      XRP: 1.5,
      DOGE: 0.15,
      ADA: 0.5,
      CAD: 1,
    };

    Object.entries(defaultRates).forEach(([symbol, rate]) => {
      if (!cachedRates![symbol]) {
        cachedRates![symbol] = rate;
      }
    });

    lastFetchTime = now;
  } catch (error) {
    console.error("Failed to fetch live CAD rates, using defaults", error);
    if (!cachedRates) {
      cachedRates = {
        BTC: 95000,
        ETH: 3500,
        USDT: 1.36,
        USDC: 1.36,
        SOL: 150,
        BNB: 600,
        XRP: 1.5,
        DOGE: 0.15,
        ADA: 0.5,
        CAD: 1,
      };
    }
  }

  return cachedRates!;
}
