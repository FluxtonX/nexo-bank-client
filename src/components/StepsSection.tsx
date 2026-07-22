"use client";

import React from "react";
import { motion } from "framer-motion";

export default function StepsSection() {
  const steps = [
    {
      number: "01",
      title: "Create your account",
      description: "Sign up online or via our mobile app in under three minutes with basic details.",
    },
    {
      number: "02",
      title: "Verify your identity",
      description: "Complete a secure, automated ID verification check for instant account approval.",
    },
    {
      number: "03",
      title: "Start banking & investing",
      description: "Instantly fund your CAD account via e-Transfer and buy your first digital assets.",
    },
  ];

  return (
    <section className="bg-slate-50/50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold uppercase tracking-widest text-[#3061EF] mb-3"
          >
            Getting Started
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-extrabold tracking-tight text-[#0B1220] sm:text-4xl leading-tight font-heading"
          >
            From signup to first trade in minutes.
          </motion.h2>
        </div>

        {/* Steps Cards Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative z-10 flex flex-col items-start bg-white p-8 rounded-[1.5rem] border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:border-[#3061EF]/40 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-300"
            >
              {/* Number Circle Badge */}
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3061EF]/10 text-[#3061EF] font-black text-sm tracking-wide mb-6 group-hover:bg-[#3061EF] group-hover:text-white transition-colors duration-300">
                {step.number}
              </div>
              <h3 className="text-lg font-bold text-[#0B1220] tracking-tight group-hover:text-[#3061EF] transition-colors duration-300 font-heading">
                {step.title}
              </h3>
              <p className="mt-3.5 text-sm leading-relaxed text-slate-500">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
