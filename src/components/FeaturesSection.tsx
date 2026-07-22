"use client";

import { motion } from "framer-motion";
import { WalletCards, Zap, TrendingUp, Globe, PiggyBank, Sparkles, LineChart, ArrowRight } from "lucide-react";
import { Button } from "./ui/Button";
import type { LandingFeaturesContent } from "@/lib/content-defaults";

const ICON_MAP: Record<number, React.ReactNode> = {
  0: <WalletCards className="w-5 h-5 text-primary-blue" />,
  1: <Zap className="w-5 h-5 text-primary-blue" />,
  2: <TrendingUp className="w-5 h-5 text-primary-blue" />,
  3: <Globe className="w-5 h-5 text-primary-blue" />,
  4: <PiggyBank className="w-5 h-5 text-primary-blue" />,
  5: <Sparkles className="w-5 h-5 text-primary-blue" />,
  6: <LineChart className="w-5 h-5 text-primary-blue" />,
};

export default function FeaturesSection({ content }: { content: LandingFeaturesContent }) {
  return (
    <section className="py-16 md:py-24 bg-white border-t border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12">
          
          {/* Left Column (Sticky Heading) */}
          <div className="lg:col-span-4 relative">
            <div className="lg:sticky lg:top-32">
              <h2 className="text-4xl md:text-[42px] font-bold text-text-primary leading-tight mb-6">
                {content.heading}
              </h2>
              <p className="text-lg text-text-secondary leading-relaxed mb-8">
                {content.sub}
              </p>
              <Button variant="secondary" className="hidden lg:inline-flex items-center gap-2">
                {content.btn} <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right Column (Feature Grid) */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {content.list.map((feature, idx) => (
                <motion.div
                  key={idx}
                  className="p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-lg hover:border-gray-200 transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <div className="w-10 h-10 bg-primary-blue/5 rounded-xl flex items-center justify-center mb-5">
                    {ICON_MAP[idx] || <Sparkles className="w-5 h-5 text-primary-blue" />}
                  </div>
                  <h3 className="text-[18px] font-semibold text-text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed text-[15px]">
                    {feature.description}
                  </p>
                </motion.div>
              ))}

              {/* 8th Card (CTA Card to complete the 2x4 grid) */}
              <motion.div
                className="p-6 rounded-2xl bg-bg-light flex flex-col justify-center items-center text-center border border-transparent"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: content.list.length * 0.1 }}
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <ArrowRight className="w-5 h-5 text-primary-blue" />
                </div>
                <h3 className="text-[18px] font-semibold text-text-primary mb-2">
                  {content.ctaCardTitle}
                </h3>
                <p className="text-text-secondary text-[15px] mb-4">
                  {content.ctaCardDesc}
                </p>
                <Button variant="primary" size="sm">
                  {content.ctaCardBtn}
                </Button>
              </motion.div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
