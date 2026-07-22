"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, WalletCards, ShieldCheck } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "The New Standard in Digital Banking",
    description: "Experience premium financial services with CDNT. Secure, fast, and designed for your modern lifestyle.",
    image: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&q=80&w=2070",
    ctaPrimary: "Open an Account",
    ctaSecondary: "Learn More",
    accent: "CDNT Advantage"
  },
  {
    id: 2,
    title: "Secure Your Crypto Future",
    description: "Manage your BTC, ETH, and USDT with confidence. Institutional-grade security for your digital assets.",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2070",
    ctaPrimary: "Explore Wallets",
    ctaSecondary: "Security First",
    accent: "Crypto Portfolio"
  },
  {
    id: 3,
    title: "Wealth Management Reimagined",
    description: "Personalized advice and sophisticated tools to help you reach your financial goals faster.",
    image: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&q=80&w=2073",
    ctaPrimary: "Get Advice",
    ctaSecondary: "View Rewards",
    accent: "Private Banking"
  }
];

export function HeroSlider() {
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[650px] w-full overflow-hidden bg-banking-ink">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] scale-110"
            style={{ backgroundImage: `url(${slides[current].image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-banking-ink via-banking-ink/70 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative mx-auto flex h-full max-w-7xl items-center px-5">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-banking-gold backdrop-blur-md">
                <ShieldCheck className="h-4 w-4" />
                {slides[current].accent}
              </div>
              <h1 className="text-5xl font-bold leading-tight text-white md:text-7xl">
                {slides[current].title}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
                {slides[current].description}
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-md bg-banking-blue px-8 py-4 text-sm font-bold text-white shadow-lg shadow-banking-blue/20 transition-all hover:bg-banking-navy hover:scale-105"
                >
                  {slides[current].ctaPrimary}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-8 py-4 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/20"
                >
                  {slides[current].ctaSecondary}
                  <WalletCards className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "h-1.5 transition-all rounded-full",
              current === i ? "w-8 bg-banking-gold" : "w-2 bg-white/30"
            )}
          />
        ))}
      </div>
    </section>
  );
}

function cn(...inputs: string[]) {
  return inputs.filter(Boolean).join(" ");
}
