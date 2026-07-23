"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export const CONTAINER = "max-w-7xl w-full mx-auto px-6";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Pricing", href: "/pricing" },
  { name: "Security", href: "/security" },
  { name: "Help", href: "/help" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="pt-4 px-4 sm:px-6 sticky top-0 z-50 flex justify-center">
      <header
        className={`w-full max-w-7xl rounded-full border px-6 py-2 flex items-center justify-between transition-all duration-500 ease-in-out ${
          isScrolled
            ? "bg-gradient-to-r from-[#022c22]/95 to-[#064e3b]/95 backdrop-blur shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-white/10"
            : "bg-gradient-to-r from-[#022c22] to-[#064e3b] shadow-lg border-white/5"
        }`}
      >
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-400 to-emerald-600 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg shadow-emerald-500/20 transition-transform duration-300 group-hover:scale-105">
              N
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white transition-transform duration-300 group-hover:scale-105">
              Nexo <span className="text-emerald-400">Bank</span>
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-[15px] transition-all duration-300 tracking-wide ${
                pathname === link.href || (pathname === '/' && link.href === '/') || (pathname !== '/' && link.href !== '/' && pathname.startsWith(link.href))
                  ? "text-[#34d399] font-semibold"
                  : "font-medium text-white/80 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/login" className="text-[15px] font-medium text-white/80 hover:text-white transition-all duration-300 tracking-wide">
            Sign in
          </Link>
          <Link href="/register" className="relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full px-7 py-2.5 text-[15px] font-medium shadow-[0_4px_14px_0_rgba(255,255,255,0.1)] hover:bg-white/20 hover:shadow-[0_6px_20px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 transition-all duration-300 inline-block text-center">
            Open Account
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-white/80 hover:text-white transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden absolute top-[76px] left-4 right-4 bg-gradient-to-b from-[#022c22] to-[#047857] rounded-3xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl z-40"
          >
            <div className="px-5 pt-5 pb-7 space-y-4">
              <nav className="flex flex-col space-y-2">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`block px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 ${
                      pathname === link.href || (pathname === '/' && link.href === '/') || (pathname !== '/' && link.href !== '/' && pathname.startsWith(link.href))
                        ? "text-[#34d399] bg-white/10 border border-white/5"
                        : "text-white/80 hover:bg-white/5 hover:text-white"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
              <div className="flex flex-col space-y-4 px-4 pt-5 border-t border-white/10">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center text-base font-medium text-white/80 hover:text-white py-2 transition-colors">
                  Sign in
                </Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full px-6 py-3.5 text-base font-semibold shadow-lg hover:bg-white/20 hover:shadow-xl transition-all active:scale-95 inline-block">
                  Open Account
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
