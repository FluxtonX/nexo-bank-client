"use client";

import React from "react";
import { Wallet, ArrowRightLeft, TrendingUp, Globe, Sparkles, LineChart, BadgePercent } from "lucide-react";
import { motion } from "framer-motion";

export default function FeatureSection() {
  const features = [
    {
      title: "Crypto + Fiat Wallet",
      description: "Manage your CAD cash and crypto balances seamlessly in one unified interface.",
      icon: Wallet,
    },
    {
      title: "Instant e-Transfer",
      description: "Send and receive funds in seconds using your email address through Interac.",
      icon: ArrowRightLeft,
    },
    {
      title: "Crypto Investing",
      description: "Buy, sell, and schedule auto-buys for top digital assets with low spreads.",
      icon: TrendingUp,
    },
    {
      title: "Global Transfers",
      description: "Send money worldwide cheaply and quickly using our digital settlement network.",
      icon: Globe,
    },
    {
      title: "Smart Savings",
      description: "Earn high-yield returns paid daily on cash balances without lockups.",
      icon: BadgePercent,
    },
    {
      title: "AI Financial Insights",
      description: "Get personalized spending alerts and tax-optimization suggestions automatically.",
      icon: Sparkles,
    },
    {
      title: "Portfolio Tracking",
      description: "Monitor asset distribution, historical gains, and overall net worth in real-time.",
      icon: LineChart,
    },
  ];

  return (
    <section className="bg-slate-50/50 py-20 lg:py-28 border-t border-slate-200/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Grid */}
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end mb-16 lg:mb-20">
          <div className="lg:col-span-7">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-xs font-bold uppercase tracking-widest text-[#3061EF] mb-3"
            >
              Canadian Banking Experience
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl font-extrabold tracking-tight text-[#0B1220] sm:text-4xl leading-tight"
            >
              Everything a modern Canadian <br className="hidden sm:inline" />
              needs from a bank.
            </motion.h2>
          </div>
          <div className="lg:col-span-5">
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base leading-relaxed text-slate-500"
            >
              Get access to daily transactional accounts, instant e-Transfers, and powerful digital currency investing in one single app.
            </motion.p>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.01, boxShadow: "0 12px 30px rgba(0,0,0,0.02)" }}
                className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 transition-all duration-300 flex items-start gap-4 shadow-sm"
              >
                {/* Small circular blue icon */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3061EF] text-white shadow-lg shadow-blue-500/15">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#0B1220] tracking-tight">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.description}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
