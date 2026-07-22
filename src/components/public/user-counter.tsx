"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

export function UserCounter() {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    const num = Math.round(latest);
    return new Intl.NumberFormat().format(num);
  });

  useEffect(() => {
    const controls = animate(count, 1000000, {
      duration: 3,
      repeat: Infinity,
      repeatDelay: 0.5,
      ease: "easeOut",
    });

    return controls.stop;
  }, [count]);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-sm font-black uppercase tracking-[0.5em] text-banking-gold mb-4">
        Live Network Pulse
      </div>
      <div className="flex items-center gap-4">
        <motion.span className="text-7xl font-black text-white tabular-nums lg:text-9xl">
          {rounded}
        </motion.span>
        <div className="h-4 w-4 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
      </div>
      <p className="mt-6 text-xl font-bold text-white/40">Verified Institutional Global Members</p>
    </div>
  );
}
