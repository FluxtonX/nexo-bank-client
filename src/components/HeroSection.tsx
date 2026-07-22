"use client";

import { motion } from "framer-motion";
import { CONTAINER } from "./Navbar";
import type { LandingHeroContent } from "@/lib/content-defaults";

export default function HeroSection({ content }: { content: LandingHeroContent }) {
  // Split the multi-line headline into individual lines.
  // Line 0 is dark (gray-900), remaining lines are brand blue.
  const headlineLines = content.headline.split("\n");

  // Parse "Value / Label" stat strings into { value, label } pairs.
  const stats = content.stats.map((s) => {
    const slashIdx = s.indexOf(" / ");
    return slashIdx !== -1
      ? { value: s.slice(0, slashIdx), label: s.slice(slashIdx + 3) }
      : { value: s, label: "" };
  });

  return (
    <section
      className="min-h-screen flex items-center overflow-hidden relative"
      style={{
        background: "linear-gradient(135deg, #EEF2FF 0%, #F8F9FF 50%, #F0E8FF 100%)"
      }}
    >
      <div className={`${CONTAINER} w-full flex flex-col lg:flex-row items-center gap-16 pt-32 pb-16`}>

        {/* ── Left Column ── */}
        <div className="flex-1 max-w-xl z-10">

          {/* Trust Badge */}
          <motion.div
            className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-sm mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[12px] text-gray-600 font-medium">
              {content.trustBadge}
            </span>
          </motion.div>

          {/* Headline — first line dark, subsequent lines blue */}
          <div className="space-y-1 mb-6">
            {headlineLines.map((line, i) => (
              <motion.h1
                key={i}
                className={`font-extrabold text-[42px] sm:text-[56px] ${
                  i === 0 ? "text-gray-900 leading-tight" : "text-primary-blue leading-none"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.15 }}
              >
                {line}
              </motion.h1>
            ))}
          </div>

          {/* Body Copy */}
          <motion.p
            className="text-gray-500 text-[16px] leading-relaxed max-w-md mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {content.body}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.75 }}
          >
            <button className="bg-primary-navy text-white rounded-full px-7 py-3.5 font-semibold text-[15px] hover:bg-blue-900 transition-all flex items-center justify-center gap-2">
              {content.btn1} <span>→</span>
            </button>
            <button className="bg-white border border-gray-200 text-gray-800 rounded-full px-7 py-3.5 font-medium text-[15px] hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2">
              {content.btn2} <span>↗</span>
            </button>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            className="flex gap-10 mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            {stats.map((stat, i) => (
              <div key={i}>
                <p className="text-[22px] font-bold text-gray-900 leading-none">{stat.value}</p>
                <p className="text-[13px] text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>

        </div>

        {/* ── Right Column — Bento Grid ── */}
        <motion.div
          className="flex-1 w-full mt-12 lg:mt-0"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {/*
            Grid layout:
            ┌──────────────┬───────────────────────┐
            │  Stat card   │   Dark bank card       │
            ├──────────────┼───────────┬────────────┤
            │              │ Spend     │            │
            │  Photo       │ card      │ Accent     │
            │              ├───────────┤ card       │
            │              │ BTC card  │            │
            └──────────────┴───────────┴────────────┘
          */}
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: "1fr 1.5fr",
              gridTemplateRows: "auto auto",
            }}
          >
            {/* ── ROW 1 ── */}

            {/* Cell A: Stat card — light */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between min-h-[150px]">
              <p className="text-[42px] font-black text-gray-900 leading-none">50+</p>
              <p className="text-[14px] text-gray-500 font-medium leading-snug mt-4">
                Years of Trusted<br />Service
              </p>
            </div>

            {/* Cell B: Dark bank card */}
            <div
              className="rounded-2xl p-6 shadow-xl text-white flex flex-col justify-between min-h-[150px]"
              style={{ background: "linear-gradient(135deg, #1A3FBB 0%, #07111F 100%)" }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-white/50 font-semibold uppercase tracking-widest">
                    Current Balance
                  </p>
                  <p className="text-[26px] font-black mt-1 tracking-tight">$48,210.94</p>
                </div>
                <div className="w-10 h-10 rounded-xl border border-[#3061EF]/60 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#3061EF]" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                  </svg>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-[12px] font-mono text-white/60 tracking-widest">
                  4321 8654 •••• 4471
                </p>
                <p className="text-[12px] text-white/50 font-semibold">09/29</p>
              </div>
            </div>

            {/* ── ROW 2 ── */}

            {/* Cell C: Photo — spans full height of row 2 */}
            <div className="rounded-2xl overflow-hidden shadow-sm" style={{ minHeight: "280px" }}>
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80"
                alt="Digital finance"
                className="w-full h-full object-cover"
                style={{ minHeight: "280px" }}
              />
            </div>

            {/* Cell D: Right column — two cards stacked */}
            <div className="flex flex-col gap-3">

              {/* Spend / growth card */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#3061EF] font-bold text-sm">▲</span>
                    <span className="text-[13px] font-semibold text-gray-600">24%</span>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-[#0B1220] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="5" width="20" height="14" rx="2"/>
                      <path d="M2 10h20"/>
                    </svg>
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Total Spend</p>
                <p className="text-[28px] font-black text-gray-900 mt-1 leading-none">$4,325</p>
              </div>

              {/* Accent card */}
              <div
                className="rounded-2xl p-5 relative overflow-hidden"
                style={{ background: "#3061EF" }}
              >
                <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-10" style={{ background: "white" }} />
                <div className="absolute right-4 bottom-4 w-14 h-14 rounded-full opacity-10" style={{ background: "white" }} />
                <p className="text-[36px] font-black text-white leading-none">2M+</p>
                <p className="text-[13px] text-white/80 font-medium mt-3 leading-snug">
                  Satisfied Global<br />Customers
                </p>
              </div>

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}