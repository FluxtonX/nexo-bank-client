"use client";

import { motion } from "framer-motion";
import { Building2, Lock, ShieldCheck, KeyRound, Users, Wallet } from "lucide-react";

const STATS = [
  "FINTRAC registered",
  "Bank-level encryption",
  "Insured deposits",
  "Multi-factor auth",
];

const FEATURES = [
  {
    title: "FINTRAC Registered",
    description: "Fully compliant with Canadian regulatory standards for financial institutions.",
    icon: <Building2 className="w-6 h-6 text-primary-blue" />,
  },
  {
    title: "Bank-level Encryption",
    description: "256-bit AES encryption protects your data and your funds at all times.",
    icon: <Lock className="w-6 h-6 text-primary-blue" />,
  },
  {
    title: "Insured Deposits",
    description: "CDIC member institution. Eligible deposits are insured up to $100,000.",
    icon: <ShieldCheck className="w-6 h-6 text-primary-blue" />,
  },
  {
    title: "Multi-Factor Auth",
    description: "Biometric + 2FA security ensures only you can access your account.",
    icon: <KeyRound className="w-6 h-6 text-primary-blue" />,
  },
  {
    title: "100,000+ Canadians",
    description: "Trusted by over a hundred thousand people to manage their financial lives.",
    icon: <Users className="w-6 h-6 text-primary-blue" />,
  },
  {
    title: "Cold Storage Custody",
    description: "98% of digital assets are held offline in geographically distributed vaults.",
    icon: <Wallet className="w-6 h-6 text-primary-blue" />,
  },
];

export default function TrustSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        


        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={idx}
              className="p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="w-12 h-12 bg-primary-blue/5 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-[20px] font-semibold text-text-primary mb-3">
                {feature.title}
              </h3>
              <p className="text-text-secondary leading-relaxed text-[15px]">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
