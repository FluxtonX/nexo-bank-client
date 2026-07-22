"use client";

import React from "react";
import { ShieldCheck, Lock, Landmark, ShieldAlert, Users, HardDrive } from "lucide-react";
import { motion } from "framer-motion";

export default function SecuritySection() {
  const securityFeatures = [
    {
      title: "FINTRAC Registered",
      description: "Registered MSB with FINTRAC, fully compliant with Canadian anti-money laundering standards.",
      icon: ShieldCheck,
    },
    {
      title: "Bank-Level Encryption",
      description: "AES-256 military-grade database encryption for all user records and transaction data.",
      icon: Lock,
    },
    {
      title: "Insured Deposits",
      description: "Eligible cash balances protected through partner tier-1 trust bank institutions up to $100,000.",
      icon: Landmark,
    },
    {
      title: "Multi-Factor Auth",
      description: "Advanced biometric security and hardware security key options to guard account access.",
      icon: ShieldAlert,
    },
    {
      title: "120,000+ Canadians",
      description: "Trusted by Canadians nationwide to handle both everyday banking and digital assets securely.",
      icon: Users,
    },
    {
      title: "Cold-Storage Custody",
      description: "98% of digital assets are held offline in secure, air-gapped multi-signature vaults.",
      icon: HardDrive,
    },
  ];

  return (
    <section className="bg-white py-20 lg:py-28 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold uppercase tracking-widest text-[#3061EF] mb-3"
          >
            Trust & Compliance
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-extrabold tracking-tight text-[#0B1220] sm:text-4xl leading-tight"
          >
            Regulated. Insured. Engineered for safety.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-base leading-relaxed text-slate-500"
          >
            CDNT is built on institutional stability and strict regulatory adherence, ensuring complete safety for your funds.
          </motion.p>
        </div>

        {/* Feature Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {securityFeatures.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.03)" }}
                className="rounded-2xl border border-slate-150 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 flex flex-col items-start"
              >
                {/* Small circular icon wrapper */}
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-[#3061EF]/10 text-[#3061EF]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-[#0B1220] tracking-tight">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{item.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
