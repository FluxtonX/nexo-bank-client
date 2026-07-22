"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Copy,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Zap,
  Lock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const slides = [
  {
    id: "deposit",
    label: "Crypto Deposit",
    eyebrow: "Step 1 of 3 — Select Asset",
    title: "Deposit Crypto in Seconds",
    description:
      "Choose your asset, select a network, and get a unique wallet address with QR code. BTC, ETH, and USDT supported with real-time confirmation tracking.",
    bullets: [
      "Unique address per asset & network",
      "QR code + one-tap copy",
      "Live confirmation tracker",
      "3-network support (Bitcoin, ERC-20, TRC-20)",
    ],
    badge: "Instant Address Generation",
    badgeColor: "bg-emerald-500",
    mockup: <DepositMockup />,
  },
  {
    id: "withdraw",
    label: "Crypto Withdraw",
    eyebrow: "6-Step Secure Flow",
    title: "Withdraw With Confidence",
    description:
      "Our multi-step withdrawal flow includes address validation, whitelist security, fee selection, 2FA confirmation, and a full status tracker — just like Coinbase.",
    bullets: [
      "Address format validation (no lost funds)",
      "Saved address whitelist (anti-fraud)",
      "Economy / Standard / Priority fee tiers",
      "2FA confirmation before broadcast",
    ],
    badge: "Bank-Grade Security",
    badgeColor: "bg-banking-blue",
    mockup: <WithdrawMockup />,
  },
  {
    id: "track",
    label: "Track & Monitor",
    eyebrow: "Real-Time Status",
    title: "Full Visibility. Zero Surprises.",
    description:
      "Every deposit and withdrawal has a dedicated status page with a live timeline — from submission to blockchain confirmation. Your money, fully tracked.",
    bullets: [
      "Submitted → Review → Approved → Confirmed",
      "TXN hash with copy button",
      "Email notification at each stage",
      "Estimated arrival countdown",
    ],
    badge: "Live Status Tracker",
    badgeColor: "bg-amber-500",
    mockup: <TrackMockup />,
  },
];

const coinImages: Record<string, string> = {
  BTC: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
  ETH: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  USDT: "https://cryptologos.cc/logos/tether-usdt-logo.png",
};

function DepositMockup() {
  const [active, setActive] = React.useState("BTC");
  return (
    <div className="w-full rounded-2xl bg-[#07111F] p-5 text-white shadow-2xl">
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
        <p className="text-xs font-bold uppercase tracking-widest text-white/40">Deposit Asset</p>
        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">KYC Verified</span>
      </div>
      <div className="flex gap-2 mb-4">
        {["BTC", "ETH", "USDT"].map((a) => (
          <button
            key={a}
            onClick={() => setActive(a)}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg border py-2 text-xs font-bold transition-all ${
              active === a
                ? "border-banking-gold bg-banking-gold/10 text-banking-gold"
                : "border-white/10 text-white/40 hover:border-white/20"
            }`}
          >
            <img src={coinImages[a]} alt={a} className="h-3 w-3 object-contain" />
            {a}
          </button>
        ))}
      </div>
      <div className="flex gap-3 items-center rounded-xl bg-white/5 border border-white/10 p-3">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-white/10 overflow-hidden p-2">
          <img src={coinImages[active]} alt={active} className="h-full w-full object-contain" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] text-white/40 mb-1">Your {active} address</p>
          <p className="truncate text-[11px] font-mono text-white/70">bc1q9northunion7k2s...4btc</p>
          <button className="mt-2 flex items-center gap-1 text-[10px] font-bold text-banking-gold">
            <Copy className="h-3 w-3" /> Copy Address
          </button>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[["Address Ready", "bg-emerald-500"], ["Awaiting Deposit", "bg-white/20"], ["Confirming", "bg-white/20"]].map(([label, dot]) => (
          <div key={label} className="rounded-lg bg-white/5 border border-white/10 p-2 text-center">
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${dot} mb-1`} />
            <p className="text-[9px] text-white/50">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 p-2">
        <AlertTriangle className="h-3 w-3 shrink-0 text-amber-400" />
        <p className="text-[9px] text-amber-300">Send only {active} on correct network</p>
      </div>
    </div>
  );
}

function WithdrawMockup() {
  const [step, setStep] = React.useState(1);
  const steps = ["Asset", "Network", "Address", "Amount", "Confirm", "Done"];
  return (
    <div className="w-full rounded-2xl bg-[#07111F] p-5 text-white shadow-2xl">
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
        <p className="text-xs font-bold uppercase tracking-widest text-white/40">Crypto Withdraw</p>
        <span className="text-[10px] font-bold text-banking-gold">Step {step} of 6</span>
      </div>
      <div className="flex gap-1 mb-5">
        {steps.map((s, i) => (
          <button key={s} onClick={() => setStep(i + 1)} className="flex-1 flex flex-col items-center gap-1">
            <div className={`h-1 w-full rounded-full transition-all ${i < step ? "bg-banking-gold" : "bg-white/10"}`} />
            <p className={`text-[8px] font-bold ${i + 1 === step ? "text-banking-gold" : "text-white/30"}`}>{s}</p>
          </button>
        ))}
      </div>
      {step === 1 && (
        <div className="space-y-2">
          {[["BTC", "0.842 BTC", "$77,800"], ["ETH", "8.21 ETH", "$27,890"], ["USDT", "19,430", "$19,430"]].map(([a, bal, val]) => (
            <button key={a} onClick={() => setStep(2)} className="w-full flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-4 py-3 hover:border-banking-gold/50 transition-all group">
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-white p-1">
                  <img src={coinImages[a]} alt={a} className="h-full w-full object-contain" />
                </div>
                <span className="text-sm font-bold">{a}</span>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/60">{bal}</p>
                <p className="text-[10px] text-banking-gold">{val}</p>
              </div>
            </button>
          ))}
        </div>
      )}
      {step === 2 && (
        <div className="space-y-2">
          {[["Bitcoin", "~30 min", "0.00005 BTC"]].map(([net, time, fee]) => (
            <button key={net} onClick={() => setStep(3)} className="w-full flex items-center justify-between rounded-xl bg-banking-gold/10 border border-banking-gold/40 px-4 py-3">
              <div>
                <p className="text-sm font-bold">{net}</p>
                <p className="text-[10px] text-white/50">Fee: {fee}</p>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-white/50"><Clock className="h-3 w-3" />{time}</div>
            </button>
          ))}
          <button onClick={() => setStep(3)} className="w-full flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-4 py-3 hover:border-white/20">
            <p className="text-sm font-bold text-white/60">ERC-20</p>
            <p className="text-[10px] text-white/40">Fee: 0.002 ETH</p>
          </button>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-3">
          <div className="rounded-xl bg-white/5 border border-white/10 p-3">
            <p className="text-[10px] text-white/40 mb-1">Destination Address</p>
            <input className="w-full bg-transparent text-xs text-white/70 outline-none placeholder:text-white/30" placeholder="bc1q... paste your BTC address" />
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2">
            <ShieldCheck className="h-3 w-3 text-emerald-400 shrink-0" />
            <p className="text-[9px] text-emerald-300">Save to whitelist for faster future withdrawals</p>
          </div>
          <button onClick={() => setStep(4)} className="w-full rounded-xl bg-banking-gold py-2.5 text-xs font-bold text-banking-ink">Continue →</button>
        </div>
      )}
      {step === 4 && (
        <div className="space-y-3">
          <div className="rounded-xl bg-white/5 border border-white/10 p-3">
            <p className="text-[10px] text-white/40 mb-1">Amount (BTC)</p>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold">0.500</span>
              <button className="rounded-lg bg-banking-gold/20 px-3 py-1 text-[10px] font-bold text-banking-gold">MAX</button>
            </div>
            <p className="mt-1 text-[10px] text-white/40">≈ $46,200 CAD</p>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-3 space-y-1">
            <div className="flex justify-between text-[10px]"><span className="text-white/40">Network Fee</span><span className="text-white/70">0.00005 BTC</span></div>
            <div className="flex justify-between text-[10px]"><span className="text-white/40">You Receive</span><span className="text-banking-gold font-bold">0.49995 BTC</span></div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] mb-1"><span className="text-white/40">Daily Limit Used</span><span className="text-white/60">$46,200 / $50,000</span></div>
            <div className="h-1.5 rounded-full bg-white/10"><div className="h-1.5 rounded-full bg-banking-gold" style={{width: "92%"}} /></div>
          </div>
          <button onClick={() => setStep(5)} className="w-full rounded-xl bg-banking-gold py-2.5 text-xs font-bold text-banking-ink">Review →</button>
        </div>
      )}
      {step === 5 && (
        <div className="space-y-3">
          <div className="rounded-xl bg-white/5 border border-white/10 p-3 space-y-2 text-[11px]">
            {[["Asset", "BTC — Bitcoin"], ["Network", "Bitcoin Mainnet"], ["To", "bc1q9...4btc"], ["Amount", "0.500 BTC"], ["Fee", "0.00005 BTC"]].map(([k, v]) => (
              <div key={k} className="flex justify-between"><span className="text-white/40">{k}</span><span className="font-bold">{v}</span></div>
            ))}
          </div>
          <div className="rounded-lg bg-white/5 border border-white/10 p-2 flex items-center gap-2">
            <input className="w-full bg-transparent text-xs outline-none text-white placeholder:text-white/30" placeholder="Enter 2FA code" />
            <Lock className="h-3 w-3 text-white/30" />
          </div>
          <button onClick={() => setStep(6)} className="w-full rounded-xl bg-banking-gold py-2.5 text-xs font-bold text-banking-ink flex items-center justify-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5" /> Confirm Withdrawal
          </button>
        </div>
      )}
      {step === 6 && (
        <div className="text-center py-4">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-emerald-500/20 mx-auto mb-3">
            <CheckCircle2 className="h-7 w-7 text-emerald-400" />
          </div>
          <p className="font-bold text-sm">Withdrawal Submitted!</p>
          <p className="text-[10px] text-white/40 mt-1">TXN: WD-90912 • Est. 30–60 min</p>
          <div className="mt-4 flex gap-2">
            <button onClick={() => setStep(1)} className="flex-1 rounded-lg bg-white/10 py-2 text-[10px] font-bold">New Withdrawal</button>
            <button className="flex-1 rounded-lg bg-banking-gold/20 border border-banking-gold/30 py-2 text-[10px] font-bold text-banking-gold">Track Status →</button>
          </div>
        </div>
      )}
    </div>
  );
}

function TrackMockup() {
  const stages = [
    { label: "Submitted", time: "14:32", done: true },
    { label: "Under Review", time: "14:35", done: true },
    { label: "Approved", time: "14:41", done: true },
    { label: "Broadcast", time: "14:43", done: false },
    { label: "Confirmed", time: "—", done: false },
  ];
  return (
    <div className="w-full rounded-2xl bg-[#07111F] p-5 text-white shadow-2xl">
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
        <p className="text-xs font-bold uppercase tracking-widest text-white/40">Withdrawal Status</p>
        <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400">In Progress</span>
      </div>
      <div className="rounded-xl bg-white/5 border border-white/10 p-3 mb-4">
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-white/40">Reference</span><span className="font-mono font-bold">WD-90912</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-white/40">Amount</span><span className="font-bold text-banking-gold">0.500 BTC</span>
        </div>
      </div>
      <div className="relative pl-4">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10" />
        {stages.map((s, i) => (
          <div key={s.label} className="relative flex items-center gap-3 mb-3">
            <div className={`absolute -left-4 h-3.5 w-3.5 rounded-full border-2 flex items-center justify-center ${s.done ? "border-banking-gold bg-banking-gold/20" : "border-white/20 bg-[#07111F]"}`}>
              {s.done && <span className="h-1.5 w-1.5 rounded-full bg-banking-gold" />}
            </div>
            <div className="flex-1 flex items-center justify-between">
              <p className={`text-xs font-bold ${s.done ? "text-white" : "text-white/30"}`}>{s.label}</p>
              <p className="text-[10px] text-white/30">{s.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 p-2">
        <p className="flex-1 truncate text-[10px] font-mono text-white/40">TXN: a1b2c3d4e5f6...9z</p>
        <button className="flex items-center gap-1 text-[10px] font-bold text-banking-gold"><Copy className="h-3 w-3" />Copy</button>
      </div>
    </div>
  );
}

export function CryptoShowcase() {
  const [current, setCurrent] = React.useState(0);
  const total = slides.length;

  React.useEffect(() => {
    const t = setInterval(() => setCurrent((p) => (p + 1) % total), 7000);
    return () => clearInterval(t);
  }, [total]);

  const slide = slides[current];

  return (
    <section className="bg-banking-ink py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-banking-gold/30 bg-banking-gold/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-banking-gold mb-6">
            <Zap className="h-3.5 w-3.5" />
            Crypto Banking Features
          </div>
          <h2 className="text-4xl font-bold text-white md:text-5xl leading-tight">
            Deposit. Withdraw. Track.<br />
            <span className="text-banking-gold">All in One Platform.</span>
          </h2>
          <p className="mt-5 max-w-2xl mx-auto text-base text-white/50 leading-relaxed">
            Institutional-grade crypto transaction tools — the same standard used by Coinbase and Binance, now inside your CDNT account.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center gap-2 mb-12">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrent(i)}
              className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                i === current
                  ? "bg-banking-gold text-banking-ink shadow-lg"
                  : "border border-white/10 text-white/40 hover:text-white hover:border-white/20"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.45 }}
            className="grid gap-12 lg:grid-cols-2 lg:items-center"
          >
            {/* Left — Info */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-banking-gold mb-4">
                {slide.eyebrow}
              </p>
              <h3 className="text-3xl font-bold text-white leading-tight md:text-4xl">
                {slide.title}
              </h3>
              <p className="mt-5 text-base text-white/50 leading-relaxed">
                {slide.description}
              </p>
              <ul className="mt-8 space-y-3">
                {slide.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-banking-gold shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-white/70">{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-banking-gold px-7 py-3.5 text-sm font-bold text-banking-ink shadow-xl hover:bg-white transition-all"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/security"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition-all"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Security Details
                </Link>
              </div>
            </div>

            {/* Right — Mockup */}
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-0 -z-10 blur-[60px] opacity-30 bg-banking-gold rounded-full scale-75" />
              <motion.div
                key={slide.id + "-mockup"}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                {slide.mockup}
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <button
            onClick={() => setCurrent((p) => (p - 1 + total) % total)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/40 hover:border-banking-gold hover:text-banking-gold transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all ${i === current ? "w-8 bg-banking-gold" : "w-2 bg-white/20"}`}
              />
            ))}
          </div>
          <button
            onClick={() => setCurrent((p) => (p + 1) % total)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/40 hover:border-banking-gold hover:text-banking-gold transition-all"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Bottom Trust Strip */}
        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 border-t border-white/10 pt-12">
          {[
            ["BTC / ETH / USDT", "3 Assets Supported"],
            ["< 60 min", "Avg. Withdrawal Time"],
            ["2FA + Whitelist", "Withdrawal Security"],
            ["24/7", "Status Tracking"],
          ].map(([val, label]) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold text-banking-gold">{val}</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-white/30">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
