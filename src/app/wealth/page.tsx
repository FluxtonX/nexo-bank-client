import { SiteShell } from "@/components/public/site-shell";
import { SimpleHeroSlider } from "@/components/public/simple-hero-slider";
import { 
  Gem, 
  TrendingUp, 
  Users2, 
  Scale, 
  ChevronRight,
  PieChart,
  Lock,
  Globe2,
  Medal,
  Building2
} from "lucide-react";
import Link from "next/link";

const wealthImages = [
  "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=2071",
  "https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?auto=format&fit=crop&q=80&w=2076",
  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=2070"
];

export default function WealthManagementPage() {
  return (
    <SiteShell>
      <main className="bg-white">
        {/* Wealth Hero */}
        <section className="relative overflow-hidden pt-28 pb-24 text-white">
          <SimpleHeroSlider images={wealthImages} overlayOpacity={0.8} />
          <div className="mx-auto max-w-7xl px-5">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
              <div className="relative z-10">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-banking-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-banking-gold border border-banking-gold/20">
                  Private Wealth & Family Office
                </div>
                <h1 className="text-5xl font-bold leading-tight lg:text-7xl">
                  Architecture for <br />
                  <span className="text-banking-gold italic">Generational Wealth.</span>
                </h1>
                <p className="mt-8 text-xl leading-relaxed text-white/50 font-medium">
                  CDNT Wealth provides bespoke investment management and 
                  holistic planning for individuals, families, and institutions who 
                  require extraordinary financial care.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link href="/register" className="rounded-lg bg-banking-gold px-8 py-4 text-sm font-bold uppercase tracking-widest text-banking-ink hover:bg-white transition-all shadow-xl">
                    Become a Private Client
                  </Link>
                  <Link href="#services" className="rounded-lg border border-white/20 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all">
                    Wealth Services
                  </Link>
                </div>
              </div>
              <div className="relative">
                 <div className="relative group">
                    <img 
                      src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=2071" 
                      alt="Luxury Wealth Management" 
                      className="rounded-[3rem] h-[550px] w-full object-cover shadow-2xl brightness-90 group-hover:scale-[1.02] transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-tr from-banking-navy/60 to-transparent pointer-events-none" />
                    
                    {/* Floating Detail Card */}
                    <div className="absolute -bottom-6 -left-6 p-8 rounded-3xl bg-white text-banking-ink shadow-2xl border border-banking-border max-w-[300px]">
                       <Medal className="h-10 w-10 text-banking-gold mb-4" />
                       <p className="text-xl font-bold leading-tight">Voted #1 Private Bank for Family Offices</p>
                       <p className="mt-2 text-[10px] font-bold text-banking-muted uppercase tracking-widest">Global Finance Awards 2026</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
          {/* Subtle gold background element */}
          <div className="absolute -right-24 top-0 h-[600px] w-[600px] rounded-full bg-banking-gold/5 blur-[120px]" />
        </section>

        {/* Wealth Services Grid */}
        <section id="services" className="py-24">
          <div className="mx-auto max-w-7xl px-5">
            <div className="text-center mb-20">
              <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-banking-blue">Holistic Stewardship</h2>
              <p className="mt-4 text-4xl font-bold text-banking-ink">Our Core Wealth Disciplines</p>
            </div>

            <div className="grid gap-12 lg:grid-cols-3">
              {[
                {
                  title: "Investment Advisory",
                  desc: "Global multi-asset portfolios designed to preserve capital and capture growth through rigorous analysis.",
                  icon: TrendingUp,
                  details: ["Alternative Assets", "Direct Private Equity", "ESG Integrated Portfolios"]
                },
                {
                  title: "Private Banking",
                  desc: "Exclusive lending and liquidity solutions tailored to the unique balance sheets of high-net-worth clients.",
                  icon: Gem,
                  details: ["Art & Luxury Asset Finance", "Custom Credit Lines", "Concierge Banking"]
                },
                {
                  title: "Legacy Planning",
                  desc: "Comprehensive estate and tax planning to ensure your family's mission and values endure for generations.",
                  icon: Scale,
                  details: ["Trust Services", "Succession Planning", "Philanthropic Advisory"]
                }
              ].map((service, i) => (
                <div key={i} className="group flex flex-col">
                  <div className="mb-8 overflow-hidden rounded-[2.5rem] bg-banking-offWhite border border-banking-border relative aspect-square group-hover:border-banking-gold transition-all">
                     <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center">
                        <div className="mb-6 h-16 w-16 rounded-2xl bg-white flex items-center justify-center text-banking-blue shadow-sm group-hover:bg-banking-blue group-hover:text-white transition-colors">
                           <service.icon className="h-8 w-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-banking-ink">{service.title}</h3>
                        <p className="mt-4 text-sm leading-relaxed text-banking-muted font-medium">{service.desc}</p>
                     </div>
                  </div>
                  <div className="mt-6 space-y-4 px-4">
                     {service.details.map(d => (
                       <div key={d} className="flex items-center justify-between group/item cursor-pointer">
                          <span className="text-xs font-bold text-banking-ink group-hover/item:text-banking-gold transition-colors">{d}</span>
                          <ChevronRight className="h-4 w-4 text-banking-muted group-hover/item:translate-x-1 transition-all" />
                       </div>
                     ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Private Client Experience */}
        <section className="py-24 bg-banking-navy text-white relative">
          <div className="mx-auto max-w-7xl px-5">
            <div className="flex flex-col lg:flex-row gap-20 items-center">
              <div className="lg:w-1/2">
                <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-banking-gold mb-6">The Client Standard</h2>
                <h3 className="text-5xl font-bold leading-tight">Personalized Attention. <br />Global Resources.</h3>
                <p className="mt-8 text-lg text-white/50 font-medium leading-relaxed">
                  As a CDNT Private Client, you are assigned a dedicated Wealth 
                  Manager supported by a global team of specialists in tax, investment, 
                  and fiduciary law.
                </p>
                
                <div className="mt-12 grid gap-6 sm:grid-cols-2">
                   {[
                     { icon: Users2, title: "Family Office", desc: "Coordinated services for complex family needs." },
                     { icon: Lock, title: "Discretionary Portfolios", desc: "Full management aligned to your goals." },
                     { icon: Globe2, title: "Global Access", desc: "Private banking offices in major global hubs." },
                     { icon: PieChart, title: "Real-time Reporting", desc: "Transparent, multi-currency asset views." }
                   ].map((feat, i) => (
                     <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                        <feat.icon className="h-6 w-6 text-banking-gold mb-3" />
                        <h5 className="font-bold">{feat.title}</h5>
                        <p className="text-xs text-white/30 mt-1">{feat.desc}</p>
                     </div>
                   ))}
                </div>
              </div>
              <div className="lg:w-1/2 relative">
                 <div className="rounded-[3rem] border border-white/10 bg-white/5 p-12 backdrop-blur-xl shadow-2xl">
                    <div className="flex items-center gap-4 mb-8">
                       <PieChart className="h-10 w-10 text-banking-gold" />
                       <h4 className="text-2xl font-bold">Asset Distribution</h4>
                    </div>
                    {/* Visual Asset Allocation */}
                    <div className="space-y-6">
                       {[
                         { label: "Equities", val: "45%", color: "bg-banking-gold" },
                         { label: "Private Equity", val: "25%", color: "bg-white/40" },
                         { label: "Alternative Fixed Income", val: "20%", color: "bg-banking-blue" },
                         { label: "Liquidity", val: "10%", color: "bg-emerald-500" },
                       ].map(item => (
                         <div key={item.label}>
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                               <span className="text-white/60">{item.label}</span>
                               <span>{item.val}</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                               <div className={`h-full ${item.color}`} style={{ width: item.val }} />
                            </div>
                         </div>
                       ))}
                    </div>
                    <div className="mt-12 pt-8 border-t border-white/10 text-center">
                       <p className="text-xs italic text-white/40">"Our philosophy is centered on the preservation of purchasing power across market cycles."</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Network Showcase */}
        <section className="py-24">
           <div className="mx-auto max-w-7xl px-5">
              <div className="text-center mb-16">
                 <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-banking-blue mb-4">Strategic Footprint</h2>
                 <h3 className="text-4xl font-bold text-banking-ink">Global Private Banking Centers</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                 {['Zurich', 'London', 'Dubai', 'Singapore', 'New York'].map(city => (
                   <div key={city} className="flex flex-col items-center">
                      <div className="h-16 w-16 rounded-full bg-banking-offWhite border border-banking-border flex items-center justify-center text-banking-blue mb-4 hover:bg-banking-navy hover:text-white transition-all cursor-pointer">
                         <Building2 className="h-6 w-6" />
                      </div>
                      <p className="text-xs font-bold uppercase tracking-widest text-banking-ink">{city}</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-white">
           <div className="mx-auto max-w-5xl px-5">
              <div className="rounded-[3rem] bg-banking-gold p-12 lg:p-20 text-banking-ink text-center relative overflow-hidden shadow-2xl">
                 <div className="relative z-10">
                    <h2 className="text-4xl font-bold lg:text-6xl">Secure Your Legacy.</h2>
                    <p className="mt-8 text-xl font-medium opacity-80 max-w-2xl mx-auto">
                       Experience the pinnacle of private wealth management. Connect 
                       with our senior advisory team to start your journey.
                    </p>
                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                       <Link href="/register" className="w-full sm:w-auto rounded-lg bg-banking-ink px-12 py-5 text-sm font-bold uppercase tracking-widest text-white hover:bg-banking-navy transition-all shadow-xl">
                          Request Membership
                       </Link>
                       <Link href="/contact" className="w-full sm:w-auto rounded-lg border border-banking-ink/20 px-12 py-5 text-sm font-bold uppercase tracking-widest text-banking-ink hover:bg-white/50 transition-all">
                          Contact Advisor
                       </Link>
                    </div>
                 </div>
                 {/* Decorative background circle */}
                 <div className="absolute right-[-10%] top-[-10%] h-96 w-96 rounded-full bg-white/20 blur-[100px]" />
              </div>
           </div>
        </section>
      </main>
    </SiteShell>
  );
}
