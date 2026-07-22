"use client";

import { SiteShell } from "@/components/public/site-shell";
import { SimpleHeroSlider } from "@/components/public/simple-hero-slider";
import { 
  CreditCard, 
  Wallet, 
  TrendingUp, 
  Home, 
  Car, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  Gift,
  Smartphone,
  Star,
  Activity,
  Bell,
  CreditCard as CardIcon,
  PieChart as ChartIcon,
  Users2,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const personalImages = [
  "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=2069",
  "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&q=80&w=2070",
  "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&q=80&w=2070"
];

const chartData = [
  { month: "Jan", val: 720000 },
  { month: "Feb", val: 750000 },
  { month: "Mar", val: 730000 },
  { month: "Apr", val: 780000 },
  { month: "May", val: 810000 },
  { month: "Jun", val: 795000 },
  { month: "Jul", val: 840000 },
  { month: "Aug", val: 880000 },
  { month: "Sep", val: 865000 },
  { month: "Oct", val: 910000 },
  { month: "Nov", val: 940000 },
  { month: "Dec", val: 912480 },
];

export default function PersonalBankingPage() {
  const [activePoint, setActivePoint] = useState(chartData[chartData.length - 1]);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <SiteShell>
      <main className="bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-28 pb-24 text-white">
          <SimpleHeroSlider images={personalImages} overlayOpacity={0.75} />
          <div className="mx-auto max-w-7xl px-5">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
              <div className="relative z-10">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-banking-gold border border-white/10">
                  Personal Banking Suite
                </div>
                <h1 className="text-5xl font-bold leading-tight lg:text-7xl">
                  Banking That <br />
                  <span className="text-banking-gold italic">Moves with You.</span>
                </h1>
                <p className="mt-8 text-xl leading-relaxed text-white/70 font-medium">
                  Experience a new standard of personal finance. From high-interest savings 
                  to premium credit cards, we provide the tools you need to build your legacy.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link href="/register" className="rounded-lg bg-banking-gold px-8 py-4 text-sm font-bold uppercase tracking-widest text-banking-ink hover:bg-white transition-all shadow-xl">
                    Open an Account
                  </Link>
                  <Link href="#products" className="rounded-lg border border-white/20 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all">
                    Explore Products
                  </Link>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="relative aspect-[4/3] rounded-[3rem] border border-white/10 bg-white/5 p-4 backdrop-blur-3xl shadow-2xl overflow-hidden group">
                   <img 
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1500" 
                    alt="Premium Banking Experience" 
                    className="h-full w-full object-cover rounded-[2.5rem] opacity-80"
                   />
                   <div className="absolute inset-0 bg-gradient-to-tr from-banking-blue/60 to-transparent" />
                   
                   <div className="absolute -bottom-6 right-10 p-6 rounded-3xl bg-white text-banking-ink shadow-2xl border border-banking-border animate-float max-w-[280px]">
                      <div className="flex items-center gap-4 mb-4">
                         <div className="h-10 w-10 rounded-full bg-banking-gold/10 flex items-center justify-center">
                            <Star className="h-5 w-5 text-banking-gold" />
                         </div>
                         <div>
                            <p className="text-[10px] font-bold text-banking-muted uppercase tracking-widest">NUB Signature</p>
                            <p className="text-sm font-bold">Infinite Wealth Card</p>
                         </div>
                      </div>
                      <div className="h-2 w-full bg-banking-offWhite rounded-full mb-3">
                         <div className="h-full w-[85%] bg-banking-gold rounded-full" />
                      </div>
                      <p className="text-[10px] font-medium text-banking-muted">Limit: $50,000 / $50,000</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute -right-24 top-0 h-[600px] w-[600px] rounded-full bg-white/5 blur-[120px]" />
        </section>

        {/* Feature Grid */}
        <section className="py-12 bg-banking-offWhite border-b border-banking-border">
          <div className="mx-auto max-w-7xl px-5">
            <div className="grid gap-8 md:grid-cols-4">
              {[
                { icon: Zap, label: "Instant Transfers", sub: "NUB Vantage Technology" },
                { icon: ShieldCheck, label: "Zero Liability", sub: "100% Fraud Protection" },
                { icon: Smartphone, label: "Mobile First", sub: "Award Winning App" },
                { icon: Gift, label: "Royal Rewards", sub: "Earn Points Everywhere" },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-banking-blue/5 flex items-center justify-center text-banking-blue">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-banking-ink">{f.label}</p>
                    <p className="text-[10px] font-bold text-banking-muted uppercase tracking-wider">{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Products Grid */}
        <section id="products" className="py-24">
          <div className="mx-auto max-w-7xl px-5">
            <div className="text-center mb-20">
              <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-banking-blue">Your Financial Toolkit</h2>
              <p className="mt-4 text-4xl font-bold text-banking-ink">Solutions for Every Life Stage</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="group rounded-[2.5rem] border border-banking-border bg-white p-10 shadow-sm transition-all hover:shadow-2xl hover:-translate-y-2">
                <div className="mb-8 grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-banking-blue transition-colors group-hover:bg-banking-blue group-hover:text-white">
                  <Wallet className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-banking-ink">Bank Accounts</h3>
                <p className="mt-4 text-sm leading-relaxed text-banking-muted font-medium">
                  Choose from our Vantage Chequing or High-Interest Savings accounts. 
                  Zero monthly fees when you maintain a minimum balance.
                </p>
                <ul className="mt-8 space-y-4 border-t border-banking-border pt-8">
                  <li className="flex items-center gap-3 text-sm font-bold text-banking-ink">
                    <ArrowRight className="h-4 w-4 text-banking-gold" /> Advantage Chequing
                  </li>
                  <li className="flex items-center gap-3 text-sm font-bold text-banking-ink">
                    <ArrowRight className="h-4 w-4 text-banking-gold" /> Performance Savings
                  </li>
                </ul>
                <Link href="/accounts" className="mt-10 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-banking-blue">
                  Compare Accounts <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="group rounded-[2.5rem] border border-banking-border bg-banking-navy p-10 shadow-sm transition-all hover:shadow-2xl hover:-translate-y-2 text-white">
                <div className="mb-8 grid h-16 w-16 place-items-center rounded-2xl bg-white/10 text-banking-gold">
                  <CreditCard className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold">Credit Cards</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/60 font-medium">
                  From cashback to travel rewards, our cards are designed to complement 
                  your lifestyle. Up to 5% back on global travel.
                </p>
                <ul className="mt-8 space-y-4 border-t border-white/10 pt-8">
                  <li className="flex items-center gap-3 text-sm font-bold">
                    <ArrowRight className="h-4 w-4 text-banking-gold" /> NUB Infinite Privilege
                  </li>
                  <li className="flex items-center gap-3 text-sm font-bold">
                    <ArrowRight className="h-4 w-4 text-banking-gold" /> Royal Cashback Visa
                  </li>
                </ul>
                <Link href="/products/credit-cards" className="mt-10 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-banking-gold">
                  Explore Cards <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="group rounded-[2.5rem] border border-banking-border bg-white p-10 shadow-sm transition-all hover:shadow-2xl hover:-translate-y-2">
                <div className="mb-8 grid h-16 w-16 place-items-center rounded-2xl bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-600 group-hover:text-white">
                  <Home className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-banking-ink">Mortgages & Loans</h3>
                <p className="mt-4 text-sm leading-relaxed text-banking-muted font-medium">
                  Competitive rates for your first home, next car, or personal project. 
                  Get pre-approved in under 60 seconds.
                </p>
                <ul className="mt-8 space-y-4 border-t border-banking-border pt-8">
                  <li className="flex items-center gap-3 text-sm font-bold text-banking-ink">
                    <ArrowRight className="h-4 w-4 text-banking-gold" /> Fixed Rate Mortgages
                  </li>
                  <li className="flex items-center gap-3 text-sm font-bold text-banking-ink">
                    <ArrowRight className="h-4 w-4 text-banking-gold" /> Personal Lines of Credit
                  </li>
                </ul>
                <Link href="#" className="mt-10 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-banking-blue">
                  Check Your Rates <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Investing Section - REAL TIME INTERACTIVE GRAPH */}
        <section className="py-24 bg-banking-navy text-white overflow-hidden relative">
          <div className="mx-auto max-w-7xl px-5">
            <div className="flex flex-col lg:flex-row gap-20 items-center">
              <div className="lg:w-1/2">
                <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-banking-gold mb-6">Investing & Wealth</h2>
                <h3 className="text-5xl font-bold leading-tight">Grow Your Wealth <br />With Intelligence.</h3>
                <p className="mt-8 text-lg text-white/60 font-medium leading-relaxed">
                  Access professional-grade investment tools. From automated portfolios 
                   to self-directed trading, we give you the edge.
                </p>
                <div className="mt-12 grid gap-8 sm:grid-cols-2">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <TrendingUp className="h-8 w-8 text-banking-gold mb-4" />
                    <h5 className="font-bold text-white">Managed Portfolios</h5>
                    <p className="mt-2 text-sm text-white/40">AI-driven rebalancing for consistent growth.</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <Car className="h-8 w-8 text-banking-gold mb-4" />
                    <h5 className="font-bold text-white">Auto Finance</h5>
                    <p className="mt-2 text-sm text-white/40">Preferred rates for NUB members.</p>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 relative">
                {/* INTERACTIVE REAL-TIME GRAPH */}
                <div className="relative rounded-[3rem] bg-[#070B14] p-10 text-white shadow-[0_50px_100px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden">
                   <div className="relative z-10 flex items-center justify-between mb-8">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                           <Activity className="h-3 w-3 text-banking-gold" />
                           <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Asset Growth Index</p>
                        </div>
                        <AnimatePresence mode="wait">
                           <motion.p 
                             key={activePoint.month}
                             initial={{ opacity: 0, y: 5 }}
                             animate={{ opacity: 1, y: 0 }}
                             exit={{ opacity: 0, y: -5 }}
                             className="text-4xl font-bold text-white tracking-tight"
                           >
                             ${activePoint.val.toLocaleString()}
                           </motion.p>
                        </AnimatePresence>
                      </div>
                      <div className="text-right">
                         <div className="flex items-center gap-1 text-emerald-400 font-bold">
                            <ArrowUpRight className="h-4 w-4" />
                            <span>14.2%</span>
                         </div>
                         <p className="text-[10px] font-bold text-white/20 uppercase mt-1">NUB PRO-QUANT</p>
                      </div>
                   </div>
                   
                   {/* INTERACTIVE CHART AREA */}
                   <div className="h-64 w-full relative" onMouseLeave={() => { setIsHovering(false); setActivePoint(chartData[chartData.length - 1]); }}>
                      {/* Grid background */}
                      <div className="absolute inset-0 grid grid-cols-6 gap-x-8 opacity-[0.03]">
                         {[...Array(6)].map((_, i) => <div key={i} className="border-r border-white" />)}
                      </div>
                      
                      <svg viewBox="0 0 400 200" className="w-full h-full relative z-10 overflow-visible">
                        <defs>
                          <linearGradient id="realtimeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FDC205" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#FDC205" stopOpacity="0" />
                          </linearGradient>
                          <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="12" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                        </defs>
                        
                        {/* Area Fill */}
                        <motion.path 
                          d="M0,180 C40,160 80,170 120,130 C160,90 200,100 240,60 C280,20 320,40 400,10 L400,200 L0,200 Z" 
                          fill="url(#realtimeGradient)"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        />
                        
                        {/* Main Path */}
                        <motion.path 
                          d="M0,180 C40,160 80,170 120,130 C160,90 200,100 240,60 C280,20 320,40 400,10" 
                          fill="transparent" 
                          stroke="#FDC205" 
                          strokeWidth="5" 
                          strokeLinecap="round"
                          filter="url(#glow-strong)"
                        />

                        {/* Interactive Vertical Line */}
                        {isHovering && (
                          <motion.line 
                             x1={(chartData.indexOf(activePoint) / (chartData.length - 1)) * 400}
                             y1="0"
                             x2={(chartData.indexOf(activePoint) / (chartData.length - 1)) * 400}
                             y2="200"
                             stroke="#FDC205"
                             strokeWidth="1"
                             strokeDasharray="4,4"
                             className="opacity-50"
                          />
                        )}

                        {/* Interactive Data Points (Invisible Hit Area) */}
                        {chartData.map((d, i) => {
                           const x = (i / (chartData.length - 1)) * 400;
                           return (
                              <rect 
                                key={i}
                                x={x - 15}
                                y="0"
                                width="30"
                                height="200"
                                fill="transparent"
                                className="cursor-pointer"
                                onMouseEnter={() => { setIsHovering(true); setActivePoint(d); }}
                              />
                           );
                        })}

                        {/* Active Dot */}
                        <motion.circle 
                          cx={(chartData.indexOf(activePoint) / (chartData.length - 1)) * 400}
                          cy={180 - ((activePoint.val - 700000) / 250000) * 170}
                          r="8"
                          fill="#FDC205"
                          className="shadow-2xl"
                        />
                      </svg>
                   </div>
                   
                   <div className="mt-10 flex justify-between px-2">
                      {chartData.filter((_, i) => i % 3 === 0).map(d => (
                        <span 
                          key={d.month} 
                          className={`text-[10px] font-black uppercase tracking-widest transition-colors ${activePoint.month === d.month ? 'text-banking-gold' : 'text-white/20'}`}
                        >
                          {d.month}
                        </span>
                      ))}
                   </div>
                   
                   {/* Hover Tooltip Mockup */}
                   {isHovering && (
                     <motion.div 
                       initial={{ opacity: 0, scale: 0.9 }}
                       animate={{ opacity: 1, scale: 1 }}
                       className="absolute top-4 right-10 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20"
                     >
                        <p className="text-[10px] font-bold text-banking-gold uppercase">{activePoint.month} Performance</p>
                        <p className="text-sm font-bold text-white">Peak Value Reached</p>
                     </motion.div>
                   )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* App Showcase */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-5 text-center">
            <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-banking-blue mb-4">Mobile Experience</h2>
            <h3 className="text-4xl font-bold text-banking-ink">Your Bank, In Your Pocket.</h3>
            <p className="mt-6 text-lg text-banking-muted font-medium max-w-2xl mx-auto">
              Download the CDNT app for the most powerful personal banking 
              experience on earth. Secure, fast, and remarkably intuitive.
            </p>
            
            <div className="mt-20 relative mx-auto max-w-sm">
              <div className="relative z-10 rounded-[3.5rem] bg-[#0A0F1C] p-3 shadow-[0_60px_120px_rgba(0,0,0,0.5)] border-[10px] border-[#1C2538]">
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-3xl z-30 flex items-center justify-center px-4">
                    <div className="flex gap-2 items-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <div className="h-1 w-6 bg-white/20 rounded-full" />
                    </div>
                </div>
                
                <div className="aspect-[9/19.5] rounded-[2.8rem] bg-[#070B14] overflow-hidden relative border border-white/5">
                   <div className="h-full flex flex-col">
                      <div className="pt-10 px-6 pb-6 flex justify-between items-center bg-gradient-to-b from-white/5 to-transparent">
                         <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-banking-gold/20 flex items-center justify-center border border-banking-gold/20">
                               <span className="text-banking-gold text-xs font-black">MS</span>
                            </div>
                            <div>
                               <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Welcome back,</p>
                               <p className="text-xs font-bold text-white">Safi</p>
                            </div>
                         </div>
                         <Bell className="h-5 w-5 text-white/40" />
                      </div>

                      <div className="flex-1 px-6 space-y-6 overflow-hidden">
                         <div className="relative h-40 w-full rounded-2xl bg-gradient-to-br from-banking-blue to-banking-navy p-5 shadow-xl border border-white/10">
                            <div className="flex justify-between items-start">
                               <ShieldCheck className="h-5 w-5 text-banking-gold" />
                               <span className="text-[10px] font-bold text-white/50 tracking-widest">VISA PLATINUM</span>
                            </div>
                            <div className="mt-8">
                               <p className="text-[10px] text-white/40 uppercase font-bold tracking-[0.2em]">Balance</p>
                               <p className="text-xl font-bold text-white">$12,482.00</p>
                            </div>
                            <div className="mt-4 flex justify-between items-end">
                               <p className="text-[10px] font-medium text-white/30 tracking-widest">**** 8201</p>
                               <div className="h-6 w-10 bg-white/10 rounded flex items-center justify-center">
                                  <div className="h-2 w-2 rounded-full bg-banking-gold/40" />
                               </div>
                            </div>
                         </div>

                         <div className="grid grid-cols-4 gap-2">
                            {[Zap, ArrowRight, Wallet, CardIcon].map((Icon, i) => (
                               <div key={i} className="aspect-square rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                                  <Icon className="h-4 w-4 text-banking-gold" />
                               </div>
                            ))}
                         </div>

                         <div className="space-y-4">
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Transactions</p>
                            {[
                               { label: "Amazon Cloud", amt: "-$89.00", date: "Today" },
                               { label: "BTC Deposit", amt: "+$1,200.00", date: "Yesterday", color: 'text-emerald-400' },
                               { label: "Starbucks", amt: "-$12.50", date: "May 12" },
                               { label: "Uber Global", amt: "-$42.20", date: "May 11" },
                            ].map((tx, i) => (
                               <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                  <div>
                                     <p className="text-[11px] font-bold text-white">{tx.label}</p>
                                     <p className="text-[9px] text-white/30 font-medium">{tx.date}</p>
                                  </div>
                                  <p className={`text-[11px] font-bold ${tx.color || 'text-white/80'}`}>{tx.amt}</p>
                               </div>
                            ))}
                         </div>
                      </div>

                      <div className="h-20 bg-[#0A0F1C]/80 backdrop-blur-xl border-t border-white/5 px-8 flex justify-between items-center">
                         <div className="flex flex-col items-center gap-1">
                            <Home className="h-5 w-5 text-banking-gold" />
                            <div className="h-1 w-1 rounded-full bg-banking-gold" />
                         </div>
                         <ChartIcon className="h-5 w-5 text-white/30" />
                         <div className="h-10 w-10 rounded-full bg-banking-gold flex items-center justify-center -translate-y-4 shadow-xl shadow-banking-gold/20">
                            <Zap className="h-5 w-5 text-banking-ink" />
                         </div>
                         <CardIcon className="h-5 w-5 text-white/30" />
                         <Users2 className="h-5 w-5 text-white/30" />
                      </div>
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/10 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
