"use client";

import * as React from "react";
import Link from "next/link";
import { 
  Menu, 
  X,
  Twitter,
  Linkedin,
  Facebook,
  Instagram
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { NexoBankLogoWhite } from "@/components/ui/NexoBankLogoWhite";


import { usePathname } from "next/navigation";

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Pricing", href: "/pricing" },
    { label: "Security", href: "/security" },
    { label: "Help", href: "/help" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 pt-6 px-4 pb-4 bg-banking-offWhite/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full bg-banking-ink px-6 shadow-2xl">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <NexoBankLogoWhite className="h-8 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-white",
                    isActive ? "text-banking-green" : "text-white/80"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/login"
              className="text-sm font-medium text-white hover:text-banking-green transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/accounts/apply"
              className="rounded-full bg-white/10 px-6 py-2.5 text-sm font-medium text-white hover:bg-white/20 border border-white/10 transition-colors"
            >
              Open Account
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-banking-ink pt-28 px-6 md:hidden"
          >
            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-2xl font-bold text-white hover:text-banking-green"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-8 flex flex-col gap-4">
                <Link
                  href="/login"
                  className="rounded-full border border-white/20 py-4 text-center text-lg font-medium text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/accounts/apply"
                  className="rounded-full bg-banking-green py-4 text-center text-lg font-bold text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Open Account
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative bg-[#022c22] pt-24 pb-12 text-white border-t border-white/5">
      {/* Background radial highlight */}
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-banking-blue/10 blur-[120px] pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-5 relative z-10">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 group">
                <NexoBankLogoWhite className="h-8 w-auto" />
            </Link>

            <p className="mt-6 max-w-sm text-sm font-medium leading-7 text-white/50">
              Bridging traditional banking with the digital asset economy. 
              Built to protect, grow, and empower your wealth with institutional-grade security.
            </p>
            
            <div className="mt-8 flex gap-4">
              {[
                { icon: Twitter, href: "#" },
                { icon: Linkedin, href: "#" },
                { icon: Facebook, href: "#" },
                { icon: Instagram, href: "#" },
              ].map((social, i) => (
                <Link 
                  key={i} 
                  href={social.href}
                  className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-[#047857] hover:text-white hover:border-[#047857] transition-all"
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#047857]">Navigation</h4>
            <ul className="mt-6 space-y-3.5">
              <li><Link href="/" className="text-sm text-white/50 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-sm text-white/50 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/pricing" className="text-sm text-white/50 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/security" className="text-sm text-white/50 hover:text-white transition-colors">Security</Link></li>
              <li><Link href="/help" className="text-sm text-white/50 hover:text-white transition-colors">Help</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#047857]">Account</h4>
            <ul className="mt-6 space-y-3.5">
              <li><Link href="/login" className="text-sm text-white/50 hover:text-white transition-colors">Sign In</Link></li>
              <li><Link href="/accounts/apply" className="text-sm text-white/50 hover:text-white transition-colors">Open Account</Link></li>
              <li><Link href="/accounts" className="text-sm text-white/50 hover:text-white transition-colors">My Accounts</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-20 border-t border-white/5 pt-8">
          <div className="flex flex-col md:flex-row justify-between gap-6 text-xs text-white/40 leading-relaxed">
            <div className="max-w-4xl space-y-3">
              <p>
                KYC verification, portfolio visibility, and support are simulated. We are not a registered bank in Canada or a licensed custody provider. 
                All digital asset representations and transactions are simulated for platform evaluation purposes.
              </p>
              <p>
                &copy; {new Date().getFullYear()} Nexo Bank Financial Services Inc. All rights reserved. 
                Member CDIC (Simulated protection applies to fiat-equivalent deposits).
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-banking-offWhite text-banking-text">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}

