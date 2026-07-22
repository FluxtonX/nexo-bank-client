"use client";

import { motion } from "framer-motion";

type AuthCardProps = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
};

export function AuthCard({ children, title, subtitle }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="w-full max-w-[480px] rounded-lg border border-white/15 bg-white p-6 text-banking-text shadow-2xl shadow-black/24 md:p-8"
    >
      <div className="mb-7">
        <h2 className="text-2xl font-semibold tracking-normal">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-banking-muted">{subtitle}</p>
      </div>
      {children}
    </motion.div>
  );
}
