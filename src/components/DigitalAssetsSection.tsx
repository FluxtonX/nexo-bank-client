"use client";

import { motion } from "framer-motion";
import { Bitcoin } from "lucide-react";
import type { LandingAssetsContent } from "@/lib/content-defaults";

const ASSETS = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: "$98,420.13",
    change: "+1.43%",
    isPositive: true,
    color: "#F7931A",
    icon: <Bitcoin className="w-6 h-6 text-white" />,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: "$3,612.04",
    change: "+0.87%",
    isPositive: true,
    color: "#627EEA",
    icon: <span className="text-white font-bold text-lg">Ξ</span>,
  },
  {
    symbol: "SOL",
    name: "Solana",
    price: "$248.92",
    change: "-0.34%",
    isPositive: false,
    color: "#14F195",
    icon: <span className="text-white font-bold text-sm">SOL</span>,
  },
  {
    symbol: "USDT",
    name: "Tether",
    price: "$1.0001",
    change: "+0.01%",
    isPositive: true,
    color: "#26A17B",
    icon: <span className="text-white font-bold text-lg">₮</span>,
  },
];

export default function DigitalAssetsSection({ content }: { content: LandingAssetsContent }) {
  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-[#0A0F2C] to-[#0D1845] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-primary-blue/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <p className="text-accent-gold font-semibold tracking-widest text-sm uppercase mb-4">
            {content.overline}
          </p>
          <h2 className="text-4xl md:text-[48px] font-bold text-white leading-tight">
            {content.heading.split(", held to a ").map((part, i) => (
              <span key={i}>
                {i > 0 && <span className="text-accent-gold">held to a </span>}
                {part}
              </span>
            ))}
          </h2>
        </div>

        {/* Asset Cards Row */}
        <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar snap-x snap-mandatory gap-6">
          {ASSETS.map((asset, idx) => (
            <motion.div
              key={idx}
              className="flex-none w-[280px] sm:w-[300px] sm:flex-1 snap-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="relative p-6 rounded-2xl bg-[#111827] border border-white/5 h-full group overflow-hidden">
                {/* Glow effect based on positive/negative */}
                <div 
                  className={`absolute -bottom-20 -right-20 w-40 h-40 blur-[60px] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none ${
                    asset.isPositive ? "bg-accent-green" : "bg-accent-red"
                  }`}
                />

                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center shadow-inner"
                      style={{ backgroundColor: asset.color }}
                    >
                      {asset.icon}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-lg">{asset.symbol}</p>
                      <p className="text-gray-400 text-sm">{asset.name}</p>
                    </div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    asset.isPositive 
                      ? "bg-accent-green/10 text-accent-green" 
                      : "bg-accent-red/10 text-accent-red"
                  }`}>
                    {asset.change}
                  </div>
                </div>

                <div>
                  <p className="text-[32px] font-bold text-white tracking-tight">
                    {asset.price}
                  </p>
                </div>
                
                {/* Simulated sparkline */}
                <div className="mt-6 h-12 w-full flex items-end opacity-50">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                    <path 
                      d={asset.isPositive 
                        ? "M0,40 C20,35 40,38 60,20 C80,5 90,15 100,5" 
                        : "M0,5 C20,10 40,5 60,25 C80,40 90,30 100,35"} 
                      fill="none" 
                      stroke={asset.isPositive ? "#22C55E" : "#EF4444"} 
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path 
                      d={asset.isPositive 
                        ? "M0,40 C20,35 40,38 60,20 C80,5 90,15 100,5 L100,40 L0,40 Z" 
                        : "M0,5 C20,10 40,5 60,25 C80,40 90,30 100,35 L100,40 L0,40 Z"} 
                      fill={`url(#gradient-${idx})`} 
                    />
                    <defs>
                      <linearGradient id={`gradient-${idx}`} x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={asset.isPositive ? "#22C55E" : "#EF4444"} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={asset.isPositive ? "#22C55E" : "#EF4444"} stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
