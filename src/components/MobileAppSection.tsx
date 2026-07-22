"use client";

import React from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

export default function MobileAppSection() {
  const bulletPoints = [
    "Send money instantly with Interac e-Transfer",
    "Manage credit cards and freeze lost cards instantly",
    "Instant notification of every transaction",
    "High-speed biometric login and facial security",
  ];

  return (
    <section className="bg-slate-50 py-20 lg:py-28 overflow-hidden border-t border-slate-200/40 border-b border-slate-200/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-12 lg:items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-xs font-bold uppercase tracking-widest text-[#3061EF] mb-3"
            >
              On The Go
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl font-extrabold tracking-tight text-[#0B1220] sm:text-4xl leading-tight"
            >
              Your entire financial life, <br />
              in your pocket.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-base leading-relaxed text-slate-500 max-w-md"
            >
              All the power of our desktop interface, optimized for mobile devices. Monitor markets, receive instant notifications, and manage accounts on the move.
            </motion.p>

            {/* Bullet Points */}
            <ul className="mt-8 space-y-4 max-w-md">
              {bulletPoints.map((point, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="flex items-center gap-3.5"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </span>
                  <span className="text-sm font-semibold text-slate-700">{point}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Right Mobile Mockups Column */}
          <div className="lg:col-span-6 relative flex justify-center items-center h-[520px] max-w-md mx-auto w-full mt-12 lg:mt-0">
            {/* 1. Back Dark iPhone */}
            <motion.div
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              className="absolute right-4 top-4 z-10 w-[230px] h-[450px] rounded-[36px] bg-[#07111F] p-2 shadow-2xl border-[5px] border-slate-800/90 transform rotate-[6deg] translate-x-[15px]"
            >
              <div className="relative w-full h-full rounded-[28px] bg-[#07111F] overflow-hidden p-4 text-white flex flex-col justify-between">
                {/* iPhone Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-900 rounded-b-xl" />

                {/* Top Section */}
                <div className="pt-4">
                  <div className="flex justify-between items-center text-[9px] text-white/50">
                    <span>Crypto Assets</span>
                    <span className="text-emerald-400 font-bold">+2.42%</span>
                  </div>
                  <div className="text-lg font-black mt-0.5">$45,210.04</div>
                </div>

                 {/* Micro Chart */}
                <div className="h-20 w-full my-1.5">
                  <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                    <path
                      d="M 0 32 C 25 12, 50 35, 75 10 C 85 2, 95 5, 100 5"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 0 32 C 25 12, 50 35, 75 10 C 85 2, 95 5, 100 5 L 100 40 L 0 40 Z"
                      fill="url(#mobile-back-grad)"
                      opacity="0.1"
                    />
                    <defs>
                      <linearGradient id="mobile-back-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Assets List */}
                <div className="space-y-1 mb-1">
                  {[
                    { sym: "BTC", val: "Bitcoin", price: "$99,420" },
                    { sym: "ETH", val: "Ethereum", price: "$2,912" },
                    { sym: "SOL", val: "Solana", price: "$219" },
                    { sym: "USDT", val: "Tether", price: "$1.0001" },
                  ].map((asset, i) => (
                    <div key={i} className="flex justify-between items-center bg-white/5 border border-white/5 px-2 py-1 rounded-lg text-[8px]">
                      <div>
                        <p className="font-extrabold leading-none">{asset.sym}</p>
                        <p className="text-[6px] text-white/40 mt-0.5">{asset.val}</p>
                      </div>
                      <span className="font-black text-white/90">{asset.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* 2. Front Light iPhone */}
            <motion.div
              animate={{
                y: [0, 12, 0],
              }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: 0.3,
              }}
              className="absolute left-4 bottom-4 z-20 w-[230px] h-[450px] rounded-[36px] bg-slate-900 p-2 shadow-2xl border-[5px] border-slate-800/90 transform rotate-[-6deg] translate-x-[-15px] translate-y-[15px]"
            >
              <div className="relative w-full h-full rounded-[28px] bg-white overflow-hidden p-4 text-[#0B1220] flex flex-col justify-between">
                {/* iPhone Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-900 rounded-b-xl" />

                {/* Header */}
                <div className="pt-4">
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">CAD Wallet</p>
                  <p className="text-lg font-black mt-0.5">$45,210.04</p>
                </div>

                {/* Bank Card Graphic */}
                <div className="rounded-xl bg-gradient-to-br from-[#0c2461] to-[#07111F] p-3 text-white shadow-md my-2">
                  <p className="text-[7px] text-white/50 uppercase tracking-wider">Debit Card</p>
                  <p className="text-sm font-black mt-0.5">$45,210.04</p>
                  <p className="text-[8px] font-mono mt-3.5 tracking-widest text-white/80">•••• •••• •••• 8824</p>
                </div>

                {/* Transactions */}
                <div className="space-y-2 mb-1">
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Recent Activity</p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[9px]">
                      <div>
                        <p className="font-extrabold text-[#0B1220]">Coffee Shop</p>
                        <p className="text-[7px] text-slate-400">08:32 AM</p>
                      </div>
                      <span className="font-extrabold text-slate-800">-$12.50</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px]">
                      <div>
                        <p className="font-extrabold text-[#0B1220]">Salary Deposit</p>
                        <p className="text-[7px] text-slate-400">Yesterday</p>
                      </div>
                      <span className="font-extrabold text-emerald-600">+$2,500</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
