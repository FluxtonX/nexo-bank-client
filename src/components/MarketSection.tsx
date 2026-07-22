"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function MarketSection() {
  const marketCoins = [
    {
      name: "Bitcoin",
      symbol: "BTC",
      price: "$98,420.13",
      change: "+2.41%",
      up: true,
      // Smoothly rises from bottom left to top right
      graph: "M 0 32 C 40 32, 60 12, 100 8",
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      price: "$3,612.04",
      change: "+1.18%",
      up: true,
      // Starts flat-ish, smoothly rises
      graph: "M 0 34 C 40 34, 60 18, 100 16",
    },
    {
      name: "Solana",
      symbol: "SOL",
      price: "$248.92",
      change: "-0.62%",
      up: false,
      // Starts mid-high, dips smoothly down
      graph: "M 0 15 C 40 15, 60 32, 100 32",
    },
    {
      name: "Tether",
      symbol: "USDT",
      price: "$1.0001",
      change: "+0.01%",
      up: true,
      // Almost perfectly flat horizontal line
      graph: "M 0 30 Q 50 29.5, 100 30",
    },
  ];

  return (
    <section className="bg-gradient-to-br from-[#014EA1] via-[#003B7A] to-[#07111F] text-white py-24 relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-[10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-sky-400/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-xs font-bold uppercase tracking-widest text-sky-300 mb-3"
            >
              Live Markets
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl leading-tight max-w-xl font-heading"
            >
              Digital assets, <br className="hidden sm:inline" />
              <span className="text-[#FDC205]">held to a higher standard.</span>
            </motion.h2>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 md:mt-0 flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest text-sky-300 w-fit"
          >
            <span className="h-2 w-2 rounded-full bg-[#10b981] animate-pulse" />
            Realtime - Streaming from 8 venues
          </motion.div>
        </div>

        {/* Coins Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {marketCoins.map((coin, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -6 }}
              className="rounded-2xl bg-[#091221] border border-white/5 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-300 flex flex-col justify-between h-[200px] relative group"
            >
              {/* Card Header Content */}
              <div className="p-6 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <h4 className="text-[15px] font-bold text-white tracking-wide">{coin.symbol}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{coin.name}</p>
                  </div>
                  <div className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded ${coin.up ? "text-[#10b981] bg-[#10b981]/10" : "text-[#ef4444] bg-[#ef4444]/10"}`}>
                    {coin.up ? <ArrowUpRight className="h-3 w-3" strokeWidth={3} /> : <ArrowDownRight className="h-3 w-3" strokeWidth={3} />}
                    {coin.change}
                  </div>
                </div>
                <div className="mt-5 text-[28px] font-bold tracking-tight text-white">{coin.price}</div>
              </div>

              {/* Card Footer Sparkline - Flush with bottom and side edges */}
              <div className="absolute bottom-0 left-0 right-0 h-[90px] w-full overflow-hidden pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                  {/* Fill Area Gradient */}
                  <path
                    d={`${coin.graph} L 100 40 L 0 40 Z`}
                    fill={coin.up ? "url(#grad-up)" : "url(#grad-down)"}
                  />
                  {/* Glowing Graph Line */}
                  <path
                    d={coin.graph}
                    fill="none"
                    stroke={coin.up ? "#10b981" : "#ef4444"}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient id="grad-up" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="grad-down" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
