"use client";

import { ArrowUpRight, ArrowDownRight, ShieldCheck } from "lucide-react";

const prices = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: "$92,350.12",
    change: "+4.8%",
    up: true,
    bg: "bg-orange-50",
    border: "border-orange-100",
    image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: "$3,395.40",
    change: "+2.1%",
    up: true,
    bg: "bg-blue-50",
    border: "border-blue-100",
    image: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  },
  {
    symbol: "BNB",
    name: "Binance",
    price: "$840.20",
    change: "+1.4%",
    up: true,
    bg: "bg-yellow-50",
    border: "border-yellow-100",
    image: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
  },
  {
    symbol: "SOL",
    name: "Solana",
    price: "$210.50",
    change: "+7.2%",
    up: true,
    bg: "bg-purple-50",
    border: "border-purple-100",
    image: "https://cryptologos.cc/logos/solana-sol-logo.png",
  },
];

export function MarketStrip() {
  return (
    <section className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_340px]">
      {prices.map((item) => (
        <div
          key={item.symbol}
          className={`flex items-center gap-3 rounded-xl border ${item.border} ${item.bg} p-4 transition-all hover:shadow-md`}
        >
          {/* Coin Icon */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm border border-banking-border p-1.5">
            <img src={item.image} alt={item.symbol} className="h-full w-full object-contain" />
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1.5">
              <p className="text-sm font-bold text-banking-text">{item.symbol}</p>
              <p className="text-[10px] text-banking-muted truncate">{item.name}</p>
            </div>
            <p className="mt-0.5 text-base font-bold text-banking-text tabular-nums">{item.price}</p>
          </div>

          {/* Change Badge */}
          <div className={`shrink-0 inline-flex items-center gap-0.5 rounded-lg px-2 py-1 text-[11px] font-bold ${
            item.up ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
          }`}>
            {item.up
              ? <ArrowUpRight className="h-3 w-3" />
              : <ArrowDownRight className="h-3 w-3" />
            }
            {item.change}
          </div>
        </div>
      ))}

      {/* Account Health */}
      <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 shadow-sm">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-emerald-800">Account Healthy</p>
          <p className="mt-0.5 text-[11px] text-emerald-600 leading-relaxed">
            KYC approved · 2FA on · No restrictions
          </p>
        </div>
      </div>
    </section>
  );
}
