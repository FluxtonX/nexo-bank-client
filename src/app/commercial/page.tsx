import { SiteShell } from "@/components/public/site-shell";
import { SimpleHeroSlider } from "@/components/public/simple-hero-slider";
import { 
  Building2, 
  BarChart3, 
  ShieldCheck, 
  ArrowRight, 
  Landmark,
  Scale,
  Ship,
  Home,
  Factory,
  Fuel,
  Network,
  Activity
} from "lucide-react";
import Link from "next/link";

const commercialImages = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070",
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=2074",
  "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=2070"
];

export default function CommercialBankingPage() {
  return (
    <SiteShell>
      <main className="bg-white">
        {/* Commercial Hero */}
        <section className="relative overflow-hidden pt-28 pb-24 text-white">
          <SimpleHeroSlider images={commercialImages} overlayOpacity={0.8} />
          <div className="mx-auto max-w-7xl px-5">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
              <div className="relative z-10">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-banking-gold border border-white/10">
                  Institutional & Corporate Finance
                </div>
                <h1 className="text-5xl font-bold leading-tight lg:text-7xl">
                  Strategic Capital for <br />
                  <span className="text-banking-gold italic">Global Leaders.</span>
                </h1>
                <p className="mt-8 text-xl leading-relaxed text-white/50 font-medium">
                  CDNT Commercial provides the sophisticated financial engineering 
                  and liquidity required to navigate complex global markets.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link href="/register" className="rounded-lg bg-banking-gold px-8 py-4 text-sm font-bold uppercase tracking-widest text-banking-ink hover:bg-white transition-all shadow-xl">
                    Connect with an Advisor
                  </Link>
                  <Link href="#solutions" className="rounded-lg border border-white/20 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all">
                    Corporate Solutions
                  </Link>
                </div>
              </div>
              <div className="relative">
                 <div className="aspect-video rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl relative group">
                    <img 
                      src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069" 
                      alt="Corporate Boardroom" 
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-[5s]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-banking-ink via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-8 left-8">
                       <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-xl bg-banking-gold/20 backdrop-blur-md flex items-center justify-center border border-banking-gold/20">
                             <Scale className="h-6 w-6 text-banking-gold" />
                          </div>
                          <div>
                             <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Global Risk</p>
                             <p className="text-lg font-bold">Mitigation Strategies</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </section>

        {/* Core Solutions Grid */}
        <section id="solutions" className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-5">
            <div className="text-center mb-20">
              <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-banking-blue">Corporate Mandate</h2>
              <p className="mt-4 text-4xl font-bold text-banking-ink">Institutional-Grade Solutions</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Corporate Lending",
                  desc: "Customized debt financing, revolving credit lines, and syndicated loans for large-scale operations.",
                  icon: Landmark,
                  features: ["Term Loans", "Bridge Financing", "Asset-Based Lending"]
                },
                {
                  title: "Treasury Management",
                  desc: "Optimize liquidity and manage global cash flows with our advanced Vantage treasury platform.",
                  icon: BarChart3,
                  features: ["Cash Concentration", "Fraud Mitigation", "Payroll Processing"]
                },
                {
                  title: "Global Trade Finance",
                  desc: "Mitigate risk in international commerce with letters of credit and expert supply chain finance.",
                  icon: Ship,
                  features: ["Import/Export LC", "Guarantees", "Trade Collections"]
                },
                {
                  title: "Equipment Leasing",
                  desc: "Acquire essential assets without heavy capital expenditure through our flexible lease structures.",
                  icon: Building2,
                  features: ["Capital Leases", "Operating Leases", "Fleet Management"]
                },
                {
                  title: "Real Estate Finance",
                  desc: "Specialized financing for commercial development, multi-family units, and industrial properties.",
                  icon: Home,
                  features: ["Construction Loans", "Acquisition", "Refinancing"]
                },
                {
                  title: "Risk Management",
                  desc: "Hedge against currency fluctuations, interest rate volatility, and commodity price changes.",
                  icon: ShieldCheck,
                  features: ["FX Hedging", "Swaps & Options", "Interest Rate Caps"]
                }
              ].map((sol, i) => (
                <div key={i} className="group p-10 rounded-[2.5rem] bg-banking-offWhite border border-banking-border hover:border-banking-blue hover:shadow-2xl transition-all">
                  <div className="mb-8 grid h-14 w-14 place-items-center rounded-xl bg-white text-banking-blue shadow-sm group-hover:bg-banking-blue group-hover:text-white transition-colors">
                    <sol.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-banking-ink">{sol.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-banking-muted font-medium">{sol.desc}</p>
                  <ul className="mt-8 space-y-3">
                    {sol.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs font-bold text-banking-ink">
                        <div className="h-1.5 w-1.5 rounded-full bg-banking-gold" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button className="mt-10 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-banking-blue hover:gap-3 transition-all">
                    Detail Overview <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Specialized Finance */}
        <section className="py-24 bg-banking-ink text-white relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-5">
            <div className="flex flex-col lg:flex-row gap-20 items-center">
              <div className="lg:w-1/2">
                <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-banking-gold mb-6">Specialized Finance</h2>
                <h3 className="text-5xl font-bold leading-tight">Capital structured for complex sectors.</h3>
                <p className="mt-8 text-lg text-white/50 font-medium leading-relaxed">
                  We don&apos;t just provide capital; we provide sector-specific insight. 
                  Our advisors have deep expertise in specialized industries to help you 
                  navigate unique regulatory and market challenges.
                </p>
                <div className="mt-12 space-y-6">
                  {[
                    { label: "Technology & SaaS", detail: "Growth capital and recurring revenue financing.", icon: Network },
                    { label: "Healthcare & Life Sciences", detail: "Working capital for R&D and clinical expansion.", icon: Activity },
                    { label: "Energy & Infrastructure", detail: "Structured finance for sustainable energy projects.", icon: Fuel },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                       <div className="h-10 w-10 shrink-0 rounded-lg bg-banking-gold/20 flex items-center justify-center">
                          <item.icon className="h-5 w-5 text-banking-gold" />
                       </div>
                       <div>
                          <p className="font-bold">{item.label}</p>
                          <p className="text-sm text-white/30">{item.detail}</p>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:w-1/2 relative">
                 <div className="absolute -left-8 -top-8 z-10 rounded-2xl bg-banking-gold px-6 py-5 text-banking-ink shadow-2xl">
                    <p className="text-[10px] font-bold uppercase tracking-widest">Specialized Finance</p>
                    <p className="mt-1 text-3xl font-bold">$4.8B</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Structured facilities</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4 pt-12">
                       <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=1470" alt="Specialized Finance advisory meeting" className="rounded-3xl h-64 w-full object-cover grayscale" />
                       <div className="bg-banking-gold p-8 rounded-3xl text-banking-ink">
                          <p className="text-3xl font-bold">140+</p>
                          <p className="text-[10px] font-bold uppercase">Regions Served</p>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                          <Factory className="h-10 w-10 text-banking-gold mb-4" />
                          <p className="font-bold">Industrial, logistics & trade</p>
                       </div>
                       <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1470" alt="Tech Banking" className="rounded-3xl h-80 w-full object-cover" />
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Treasury Insights - REUSE RICH GRAPH STYLE */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-5">
            <div className="flex flex-col lg:flex-row gap-20 items-center">
              <div className="lg:w-1/2 order-2 lg:order-1">
                 {/* Bloomberg style interactive chart mockup */}
                 <div className="bg-[#0A0F1C] p-8 md:p-10 rounded-[3rem] shadow-2xl border border-white/10 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-8 relative z-10">
                       <div>
                          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Global Liquidity Status</p>
                          <p className="text-3xl font-bold text-white">OPTIMIZED</p>
                          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-emerald-300">USD / EUR / GBP / JPY / SGD</p>
                       </div>
                       <div className="rounded-2xl border border-banking-gold/30 bg-banking-gold/10 px-4 py-3 text-right">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Efficiency</p>
                          <p className="text-xl font-bold text-banking-gold">98.4%</p>
                       </div>
                    </div>
                    <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_130px]">
                      <div className="h-56 w-full rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                       <svg viewBox="0 0 420 180" className="w-full h-full">
                          <defs>
                            <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#FDC205" stopOpacity="0.28" />
                              <stop offset="100%" stopColor="#FDC205" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          {[40,80,120,160].map(y => (
                            <line key={y} x1="0" x2="420" y1={y} y2={y} stroke="rgba(255,255,255,0.06)" />
                          ))}
                          <path d="M10,150 L80,128 L150,92 L220,105 L290,58 L360,42 L410,30 L410,170 L10,170 Z" fill="url(#goldFill)" />
                          <path d="M10,150 Q80,128 150,92 T290,58 T410,30" fill="transparent" stroke="#FDC205" strokeWidth="4" strokeLinecap="round" />
                          {[80,150,220,290,360,410].map((x, i) => (
                            <circle key={x} cx={x} cy={[128,92,105,58,42,30][i]} r="5" fill="#FDC205" stroke="#0A0F1C" strokeWidth="3" />
                          ))}
                       </svg>
                      </div>
                      <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                        {[
                          ["FX exposure", "-18%"],
                          ["Idle cash", "-32%"],
                          ["Settlement", "T+0"],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">{label}</p>
                            <p className="mt-1 text-xl font-bold text-white">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-8 grid grid-cols-5 gap-3 relative z-10">
                       {[
                        ["USD", "42%", "h-20"],
                        ["EUR", "24%", "h-14"],
                        ["GBP", "14%", "h-11"],
                        ["JPY", "9%", "h-8"],
                        ["SGD", "11%", "h-10"],
                       ].map(([c, pct, height]) => (
                         <div key={c} className="text-center">
                            <div className="mx-auto flex h-24 items-end justify-center rounded-xl bg-white/[0.03] px-3 py-2">
                              <div className={`${height} w-full rounded-t-lg bg-gradient-to-t from-banking-gold to-emerald-300`} />
                            </div>
                            <p className="mt-3 text-[10px] font-bold text-white/35">{c}</p>
                            <p className="text-xs font-bold text-white">{pct}</p>
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mx-auto mt-1" />
                         </div>
                       ))}
                    </div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(253,194,5,0.05),transparent)]" />
                 </div>
              </div>
              <div className="lg:w-1/2 order-1 lg:order-2">
                 <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-banking-blue mb-6">Treasury Vantage</h2>
                 <h3 className="text-5xl font-bold text-banking-ink leading-tight">Master Your Global <br />Liquidity.</h3>
                 <p className="mt-8 text-lg text-banking-muted font-medium leading-relaxed">
                   Our commercial dashboard provides a single window into your entire 
                   global financial operation. Monitor balances, manage payables, and 
                   execute foreign exchange with institutional precision.
                 </p>
                 <button className="mt-10 rounded-lg bg-banking-blue px-10 py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-banking-ink transition-all shadow-xl">
                    Request Demo
                 </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-banking-offWhite">
           <div className="mx-auto max-w-5xl px-5 text-center">
              <h2 className="text-4xl font-bold text-banking-ink">Empower Your Commercial Future</h2>
              <p className="mt-6 text-lg text-banking-muted font-medium">
                 Connect with our commercial banking specialists to design a financial 
                 architecture that supports your global expansion.
              </p>
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                 <Link href="/register" className="w-full sm:w-auto rounded-lg bg-banking-gold px-12 py-5 text-sm font-bold uppercase tracking-widest text-banking-ink hover:bg-white transition-all shadow-xl">
                    Get Verified Now
                 </Link>
                 <button className="w-full sm:w-auto rounded-lg border border-banking-border bg-white px-12 py-5 text-sm font-bold uppercase tracking-widest text-banking-ink hover:bg-banking-offWhite transition-all">
                    Contact Advisory
                 </button>
              </div>
           </div>
        </section>
      </main>
    </SiteShell>
  );
}
