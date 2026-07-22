"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MegaMenuProps {
  label: string;
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  children: React.ReactNode;
  className?: string;
}

export function MegaMenu({ label, isOpen, onMouseEnter, onMouseLeave, children, className }: MegaMenuProps) {
  return (
    <div 
      className="relative flex h-full items-center"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button className={cn(
        "flex items-center gap-1 px-3 py-2 text-sm font-bold transition-all rounded-md",
        isOpen ? "bg-white/10 text-banking-gold" : "text-banking-text",
        className
      )}>
        {label}
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-[-100px] top-full z-50 w-[900px] border border-banking-border bg-white shadow-2xl rounded-b-xl overflow-hidden"
          >
            <div className="grid grid-cols-4 gap-8 p-10">
              {children}
            </div>
            <div className="bg-banking-offWhite p-5 border-t border-banking-border text-center">
              <Link href="#" className="text-xs font-bold uppercase tracking-widest text-banking-blue hover:underline">
                Explore all {label.toLowerCase()} solutions
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


export function MenuSection({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-banking-text">{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link 
              href={link.href} 
              className="text-[13px] text-banking-muted hover:text-banking-blue hover:underline"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
