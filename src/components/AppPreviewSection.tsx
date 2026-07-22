"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import type { LandingAppContent } from "@/lib/content-defaults";

export default function AppPreviewSection({ content }: { content: LandingAppContent }) {
  return (
    <section className="py-16 md:py-24 bg-bg-light overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          
          {/* Left Column */}
          <motion.div 
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-accent-gold font-semibold tracking-widest text-sm uppercase mb-4">
              {content.overline}
            </p>
            <h2 className="text-4xl md:text-[42px] font-bold text-text-primary leading-tight mb-6">
              {content.heading.split(", ").map((part, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {part}
                  {i === 0 && ","}
                </span>
              ))}
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed mb-8">
              {content.body}
            </p>

            <ul className="space-y-4">
              {content.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-primary-blue mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-text-secondary text-base leading-relaxed">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right Column (Phones) */}
          <div className="order-1 lg:order-2 relative h-[500px] sm:h-[600px] w-full flex justify-center items-center">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary-blue/15 blur-[80px] rounded-full z-0" />

            <motion.div
              className="absolute left-[10%] sm:left-[15%] w-[240px] sm:w-[280px] z-10"
              initial={{ opacity: 0, y: 50, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: -5 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Image
                src="/assets/phone-light.png"
                alt="Canadian National Trust Bank App Interface"
                width={300}
                height={600}
                className="w-full h-auto drop-shadow-2xl rounded-[2.5rem]"
              />
            </motion.div>

            <motion.div
              className="absolute right-[10%] sm:right-[15%] top-8 sm:top-12 w-[240px] sm:w-[280px] z-20"
              initial={{ opacity: 0, y: 50, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: 5 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Image
                src="/assets/phone-dark.png"
                alt="CDNT Crypto Portfolio Interface"
                width={300}
                height={600}
                className="w-full h-auto drop-shadow-2xl rounded-[2.5rem]"
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
