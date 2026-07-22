export const SUPPORTED_INTERVALS = ["1m", "30m", "1h"] as const;

export type SupportedInterval = (typeof SUPPORTED_INTERVALS)[number];

export type CoinConfig = {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  label: string;
  pairLabel: string;
  logoUrl: string;
};

export const COINS: CoinConfig[] = [
  { symbol: "BTCUSDT", baseAsset: "BTC", quoteAsset: "USDT", label: "Bitcoin", pairLabel: "BTC/USDT", logoUrl: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" },
  { symbol: "ETHUSDT", baseAsset: "ETH", quoteAsset: "USDT", label: "Ethereum", pairLabel: "ETH/USDT", logoUrl: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
  { symbol: "USDTUSDT", baseAsset: "USDT", quoteAsset: "USDT", label: "Tether", pairLabel: "USDT/USDT", logoUrl: "https://cryptologos.cc/logos/tether-usdt-logo.png" },
  { symbol: "BNBUSDT", baseAsset: "BNB", quoteAsset: "USDT", label: "BNB", pairLabel: "BNB/USDT", logoUrl: "https://cryptologos.cc/logos/bnb-bnb-logo.png" },
  { symbol: "SOLUSDT", baseAsset: "SOL", quoteAsset: "USDT", label: "Solana", pairLabel: "SOL/USDT", logoUrl: "https://cryptologos.cc/logos/solana-sol-logo.png" },
  { symbol: "XRPUSDT", baseAsset: "XRP", quoteAsset: "USDT", label: "XRP", pairLabel: "XRP/USDT", logoUrl: "https://cryptologos.cc/logos/xrp-xrp-logo.png" },
  { symbol: "ADAUSDT", baseAsset: "ADA", quoteAsset: "USDT", label: "Cardano", pairLabel: "ADA/USDT", logoUrl: "https://cryptologos.cc/logos/cardano-ada-logo.png" },
];

export function getCoinBySymbol(symbol: string) {
  return COINS.find((coin) => coin.symbol === symbol.toUpperCase());
}

export function isSupportedSymbol(symbol: string) {
  return Boolean(getCoinBySymbol(symbol));
}

export function isSupportedInterval(interval: string): interval is SupportedInterval {
  return SUPPORTED_INTERVALS.includes(interval as SupportedInterval);
}
