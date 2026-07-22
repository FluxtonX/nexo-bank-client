"use client";

import React from "react";

const items = [
  { symbol: "BTC", price: "$98,420.13", change: "+2.41%", up: true  },
  { symbol: "ETH", price: "$3,612.04",  change: "+1.18%", up: true  },
  { symbol: "SOL", price: "$248.92",    change: "-0.62%", up: false },
  { symbol: "USDT", price: "$1.0001",   change: "+0.01%", up: true  },
];

function TickerItem({ symbol, price, change, up }: { symbol: string; price: string; change: string; up: boolean }) {
  return (
    <div className="flex items-center gap-1.5 mx-8 whitespace-nowrap">
      <span className="text-sm font-bold text-gray-800">{symbol}</span>
      <span className="text-sm text-gray-500">{price}</span>
      <span className={`text-xs font-medium ${up ? "text-green-500" : "text-red-500"}`}>
        {up ? "↑" : "↓"}{change}
      </span>
    </div>
  );
}

export default function TickerBar() {
  return (
    <div className="relative overflow-hidden border-t border-b border-gray-100 bg-white py-3">
      
      {/* LIVE badge — pinned left */}
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center bg-white px-4 gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs font-semibold text-gray-700 tracking-wide">LIVE</span>
      </div>

      {/* Left fade overlay */}
      <div className="ticker-fade-left" />

      {/* Scrolling track — items duplicated for seamless loop */}
      <div className="ticker-track pl-[120px]">
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <TickerItem key={i} {...item} />
        ))}
      </div>

      {/* Right fade overlay */}
      <div className="ticker-fade-right" />
    </div>
  );
}
