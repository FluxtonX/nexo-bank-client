"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LockKeyhole, ShieldCheck } from "lucide-react";

type AuthShellProps = {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
};

export function AuthShell({
  children,
  eyebrow,
  title,
  description,
}: AuthShellProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-auth-radial text-white">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 gap-10 px-5 py-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <section className="flex min-h-[42vh] flex-col justify-between py-4 lg:min-h-0 lg:py-8">
          <Link href="/" className="inline-flex w-fit items-center gap-3">
            <div className="h-20 md:h-24 w-auto min-w-[270px]">
              <img 
                src="/cdnt-logo.png" 
                alt="CDNT Logo" 
                className="h-full w-auto object-contain" 
              />
            </div>
          </Link>


          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="max-w-2xl py-12 lg:py-0"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/9 px-4 py-2 text-sm font-medium text-white/86 backdrop-blur">
              <ShieldCheck className="h-4 w-4 text-banking-gold" />
              {eyebrow}
            </div>
            <h1 className="text-4xl font-semibold leading-tight tracking-normal md:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/74 md:text-lg">
              {description}
            </p>
          </motion.div>

          <div className="grid max-w-2xl gap-3 text-sm text-white/70 sm:grid-cols-3">
            {["Bank-grade security", "KYC ready", "2FA protected"].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-md border border-white/12 bg-white/7 px-3 py-3 backdrop-blur"
                >
                  <LockKeyhole className="h-4 w-4 text-banking-gold" />
                  <span>{item}</span>
                </div>
              ),
            )}
          </div>
        </section>

        <section className="flex items-center justify-center pb-8 lg:pb-0">
          {children}
        </section>
      </div>
    </main>
  );
}
