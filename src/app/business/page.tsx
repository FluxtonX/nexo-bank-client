import { SiteShell } from "@/components/public/site-shell";
import { SimpleHeroSlider } from "@/components/public/simple-hero-slider";
import { 
  Building2, 
  BarChart4, 
  Globe2, 
  Briefcase, 
  Users, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Landmark,
  FileText,
  PieChart
} from "lucide-react";
import Link from "next/link";

const businessImages = [
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=2070",
  "https://images.unsplash.com/photo-1664575602276-acd073f104c1?auto=format&fit=crop&q=80&w=2070",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=2070"
];

export default function BusinessBankingPage() {
  return (
    <SiteShell>
      <main className="bg-white">
        {/* Business Hero */}
        <section className="relative overflow-hidden pt-28 pb-24 text-white">
          <SimpleHeroSlider images={businessImages} overlayOpacity={0.8} />
          <div className="mx-auto max-w-7xl px-5">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
              <div className="relative z-10">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-banking-gold/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-banking-gold border border-banking-gold/20">
                  Commercial & Small Business
                </div>
                <h1 className="text-5xl font-bold leading-tight lg:text-7xl">
                  Fueling Your <br />
                  <span className="text-banking-gold italic">Global Ambition.</span>
                </h1>
                <p className="mt-8 text-xl leading-relaxed text-white/60">
                  CDNT provides the capital, liquidity, and intelligence to scale 
                  your business from local startup to global enterprise.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link href="/register" className="rounded-lg bg-banking-gold px-8 py-4 text-sm font-bold uppercase tracking-widest text-banking-ink hover:bg-white transition-all shadow-xl shadow-banking-gold/10">
                    Open Business Account
                  </Link>
                  <Link href="#solutions" className="rounded-lg border border-white/20 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all">
                    Our Solutions
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-10 duration-1000">
                  <div className="space-y-4 pt-12">
                    <div className="rounded-[2.5rem] bg-white/5 border border-white/10 p-8 backdrop-blur-xl">
                      <BarChart4 className="h-8 w-8 text-banking-gold mb-4" />
                      <p className="text-3xl font-bold">$5M+</p>
                      <p className="text-[10px] font-bold uppercase text-white/40">Credit Facilities</p>
                    </div>
                    <div className="rounded-[2.5rem] bg-banking-gold p-8 text-banking-ink">
                      <Globe2 className="h-8 w-8 mb-4" />
                      <p className="text-2xl font-bold">24/7</p>
                      <p className="text-[10px] font-bold uppercase opacity-60">Global Treasury</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-[2.5rem] bg-banking-blue p-8 text-white shadow-2xl">
                      <Users className="h-8 w-8 text-banking-gold mb-4" />
                      <p className="text-2xl font-bold">Unlimited</p>
                      <p className="text-[10px] font-bold uppercase opacity-60">Team Access</p>
                    </div>
                    <div className="rounded-[2.5rem] bg-white/5 border border-white/10 p-8 backdrop-blur-xl">
                      <ShieldCheck className="h-8 w-8 text-emerald-400 mb-4" />
                      <p className="text-2xl font-bold">Vantage</p>
                      <p className="text-[10px] font-bold uppercase text-white/40">Fraud Guard</p>
                    </div>
                  </div>
                </div>
                {/* Background glow */}
                <div className="absolute -z-10 inset-0 bg-banking-gold/10 rounded-full blur-[120px]" />
              </div>
            </div>
          </div>
        </section>

        {/* Industry Focus Sections */}
        <section id="solutions" className="py-24 border-b border-banking-border">
          <div className="mx-auto max-w-7xl px-5">
            <div className="text-center mb-20">
              <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-banking-blue">Business Solutions</h2>
              <p className="mt-4 text-4xl font-bold text-banking-ink">Tailored for Every Industry</p>
            </div>

            <div className="grid gap-12 lg:grid-cols-3">
              {[
                {
                  title: "Small Business",
                  desc: "Streamlined banking for entrepreneurs and small teams. Manage payroll, taxes, and expenses in one unified dashboard.",
                  icon: Briefcase,
                  links: ["Startup Banking", "Business Credit Cards", "Merchant Services"]
                },
                {
                  title: "Commercial Banking",
                  desc: "Advanced treasury management and structured finance for mid-to-large sized companies seeking growth.",
                  icon: Building2,
                  links: ["Treasury Services", "Equipment Finance", "Real Estate Loans"]
                },
                {
                  title: "Institutional Assets",
                  desc: "High-volume liquidity and institutional-grade custody for funds, family offices, and digital asset firms.",
                  icon: Landmark,
                  links: ["Custody Solutions", "Prime Brokerage", "API Integration"]
                }
              ].map((sol, i) => (
                <div key={i} className="group p-10 rounded-[3rem] bg-banking-offWhite border border-banking-border hover:border-banking-gold hover:shadow-2xl transition-all">
                  <div className="mb-8 grid h-16 w-16 place-items-center rounded-2xl bg-white text-banking-blue shadow-sm group-hover:bg-banking-blue group-hover:text-white transition-colors">
                    <sol.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-banking-ink">{sol.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-banking-muted font-medium">{sol.desc}</p>
                  <div className="mt-8 space-y-4">
                    {sol.links.map(link => (
                      <Link key={link} href="#" className="flex items-center justify-between p-4 rounded-xl bg-white border border-banking-border hover:border-banking-blue transition-all group/link">
                        <span className="text-xs font-bold text-banking-ink">{link}</span>
                        <ArrowRight className="h-4 w-4 text-banking-gold group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Global Treasury Management */}
        <section className="py-24 bg-white overflow-hidden relative">
          <div className="mx-auto max-w-7xl px-5">
            <div className="flex flex-col lg:flex-row gap-20 items-center">
              <div className="lg:w-1/2 relative order-2 lg:order-1">
                 <div className="relative z-10 rounded-[3rem] border border-banking-border bg-white p-12 shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                       <h4 className="text-xl font-bold text-banking-ink">Cash Flow Insight</h4>
                       <PieChart className="h-6 w-6 text-banking-gold" />
                    </div>
                    <div className="space-y-6">
                       {[
                         { label: "Accounts Payable", value: "$412,000", color: "bg-banking-blue" },
                         { label: "Receivables", value: "$892,500", color: "bg-banking-gold" },
                         { label: "Global Liquidity", value: "$1.2M", color: "bg-emerald-500" },
                       ].map(item => (
                         <div key={item.label} className="space-y-2">
                           <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-banking-muted">
                              <span>{item.label}</span>
                              <span className="text-banking-ink">{item.value}</span>
                           </div>
                           <div className="h-2 w-full bg-banking-offWhite rounded-full overflow-hidden">
                              <div className={`h-full ${item.color}`} style={{ width: '70%' }} />
                           </div>
                         </div>
                       ))}
                    </div>
                 </div>
                 {/* Decorative background circle */}
                 <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-banking-blue/5 blur-[100px]" />
              </div>
              <div className="lg:w-1/2 order-1 lg:order-2">
                <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-banking-gold mb-6">Unified Treasury</h2>
                <h3 className="text-5xl font-bold text-banking-ink leading-tight">Master Your Global <br />Cash Flow.</h3>
                <p className="mt-8 text-lg text-banking-muted font-medium leading-relaxed">
                  The NUB Business Dashboard provides real-time visibility into your 
                  operations across multiple currencies, jurisdictions, and asset classes.
                </p>
                <ul className="mt-10 space-y-6">
                  {[
                    { icon: FileText, title: "Automated Reconciliation", desc: "Sync with Xero, QuickBooks, and Sage instantly." },
                    { icon: Globe2, title: "Multi-Currency IBANs", desc: "Local collection in 30+ countries without foreign accounts." },
                    { icon: TrendingUp, title: "Yield Management", desc: "Earn up to 4.5% APY on idle business cash balances." },
                  ].map((feat, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-banking-blue">
                        <feat.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h5 className="font-bold text-banking-ink">{feat.title}</h5>
                        <p className="text-sm text-banking-muted">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Team Collaboration */}
        <section className="py-24 bg-banking-navy text-white">
          <div className="mx-auto max-w-4xl px-5 text-center">
            <Users className="h-16 w-16 text-banking-gold mx-auto mb-8" />
            <h2 className="text-4xl font-bold italic">Built for Modern Teams</h2>
            <p className="mt-6 text-xl text-white/60 leading-relaxed font-medium">
              Grant custom access levels to your accountants, managers, and partners. 
              Review transactions, set spending limits, and approve payments with 
              multi-signature security.
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-3">
                 <ShieldCheck className="h-4 w-4 text-banking-gold" />
                 <span className="text-sm font-bold">Role-Based Access Control</span>
              </div>
              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-3">
                 <ShieldCheck className="h-4 w-4 text-banking-gold" />
                 <span className="text-sm font-bold">Audit Logs & Compliance</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-5">
            <div className="rounded-[3rem] bg-banking-blue p-12 lg:p-20 text-white text-center relative overflow-hidden shadow-2xl">
              <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold md:text-6xl">Ready to Expand?</h2>
                <p className="mt-8 text-xl text-white/70 font-medium">
                  Join the world's most ambitious businesses. Open your CDNT 
                  Business account today and unlock global growth.
                </p>
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/register" className="w-full sm:w-auto rounded-lg bg-banking-gold px-12 py-5 text-sm font-bold uppercase tracking-widest text-banking-ink hover:bg-white transition-all shadow-xl">
                    Get Started Now
                  </Link>
                  <Link href="/contact" className="w-full sm:w-auto rounded-lg border border-white/20 px-12 py-5 text-sm font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all">
                    Talk to an Expert
                  </Link>
                </div>
              </div>
              {/* Abstract background design */}
              <div className="absolute left-[-5%] bottom-[-10%] h-64 w-64 rounded-full bg-white/10 blur-[100px]" />
              <div className="absolute right-[-5%] top-[-10%] h-64 w-64 rounded-full bg-banking-gold/10 blur-[100px]" />
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
