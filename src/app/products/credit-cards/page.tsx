import Link from "next/link";
import { 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import { SiteShell } from "@/components/public/site-shell";
import { creditCards } from "@/data/mock";
import { cn } from "@/lib/utils";

function ProductCard({ card }: { card: typeof creditCards[0] }) {
  return (
    <div className="flex flex-col rounded-3xl border border-banking-border bg-white shadow-sm hover:shadow-2xl hover:border-banking-blue transition-all overflow-hidden group">
      <div className="relative h-56 overflow-hidden bg-banking-ink">
        <img
          src={card.image}
          alt={`${card.name} lifestyle benefits`}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-banking-ink/88 via-banking-ink/44 to-banking-ink/14" />
        <div className="absolute inset-0 bg-gradient-to-t from-banking-ink/60 via-transparent to-transparent" />
        <div className="absolute left-6 right-6 top-6 z-10">
          <span className="inline-flex rounded-full border border-banking-gold/30 bg-banking-gold/12 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-banking-gold backdrop-blur">
            {card.type}
          </span>
        </div>
        <div className="absolute bottom-6 left-6 right-6 z-10">
          <h3 className="max-w-[260px] text-2xl font-semibold leading-tight text-white">{card.name}</h3>
          <p className="mt-2 text-xs font-medium leading-5 text-white/72">{card.rewards}</p>
        </div>
      </div>
      
      <div className="p-8 flex-1 flex flex-col">
        <div className="flex justify-between items-baseline mb-6">
          <span className="text-sm font-bold text-banking-muted uppercase tracking-wider">{card.type}</span>
          <div className="text-right">
            <span className="text-2xl font-bold text-banking-text">{card.annualFee}</span>
            <span className="block text-[10px] font-bold text-banking-muted uppercase">Annual Fee</span>
          </div>
        </div>

        <div className="space-y-4 mb-8 flex-1">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-banking-offWhite border border-banking-border">
            <Zap className="h-5 w-5 text-banking-gold shrink-0" />
            <p className="text-sm font-bold text-banking-text">{card.rewards}</p>
          </div>
          <div className="space-y-2">
            {card.perks.map(perk => (
              <div key={perk} className="flex items-center gap-2 text-xs font-medium text-banking-muted">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                {perk}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-banking-border mt-auto">
          <div className="flex justify-between items-center mb-6">
             <span className="text-xs font-bold text-banking-muted">Purchase Rate</span>
             <span className="text-sm font-bold text-banking-text">{card.interestRate}</span>
          </div>
          <Link 
            href="/register" 
            className="block w-full rounded-xl bg-banking-blue py-3.5 text-center text-sm font-bold text-white shadow-lg hover:bg-banking-navy transition-all"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CreditCardsPage() {
  return (
    <SiteShell>
      <main className="bg-banking-offWhite min-h-screen pb-24">
        {/* Hero Section */}
        <section className="bg-banking-navy py-20 text-white relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-5 relative z-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-banking-gold uppercase tracking-widest border border-white/10 mb-6">
                <ShieldCheck className="h-4 w-4" />
                Secure Credit Solutions
              </div>
              <h1 className="text-4xl font-bold md:text-6xl leading-tight">Cards Designed for Your Ambition.</h1>
              <p className="mt-6 text-lg text-white/70 leading-relaxed">
                Whether you&apos;re looking for premium travel rewards, everyday cashback, or institutional-grade credit limits, CDNT has the perfect card for your financial journey.
              </p>
            </div>
          </div>
          {/* Decorative background */}
          <div className="absolute right-[-10%] top-[-10%] h-96 w-96 rounded-full bg-banking-blue/20 blur-[120px]" />
        </section>

        {/* Filters/Tabs (Static) */}
        <div className="bg-white border-b border-banking-border sticky top-0 z-20">
          <div className="mx-auto max-w-7xl px-5 h-14 flex items-center gap-8 overflow-x-auto no-scrollbar">
            {["All Cards", "Travel", "Cashback", "No Annual Fee", "Business"].map((tab, idx) => (
              <button 
                key={tab} 
                className={cn(
                  "text-xs font-bold uppercase tracking-widest whitespace-nowrap border-b-2 h-full transition-all",
                  idx === 0 ? "border-banking-blue text-banking-blue" : "border-transparent text-banking-muted hover:text-banking-text"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <section className="mx-auto max-w-7xl px-5 mt-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {creditCards.map(card => (
              <ProductCard key={card.name} card={card} />
            ))}
          </div>
        </section>

        {/* Comparison Table Section */}
        <section className="mx-auto max-w-7xl px-5 mt-24">
          <div className="rounded-3xl bg-white border border-banking-border p-10 shadow-sm">
            <h2 className="text-2xl font-bold text-banking-text mb-8">Compare Card Benefits at a Glance</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-banking-border">
                  <tr>
                    <th className="pb-6 text-xs font-bold uppercase tracking-widest text-banking-muted">Feature</th>
                    {creditCards.map(card => (
                      <th key={card.name} className="pb-6 px-4 text-sm font-bold text-banking-text">{card.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-banking-border">
                  {[
                    ["Rewards Rate", "rewards"],
                    ["Interest Rate", "interestRate"],
                    ["Annual Fee", "annualFee"],
                    ["Travel Perks", "perks", true],
                  ].map(([label, key, isList]) => (
                    <tr key={label as string} className="group hover:bg-banking-offWhite transition-colors">
                      <td className="py-6 text-sm font-bold text-banking-muted pr-4">{label as string}</td>
                      {creditCards.map(card => (
                        <td key={card.name} className="py-6 px-4 text-sm font-medium text-banking-text">
                          {isList ? (
                            <ul className="space-y-1">
                              {(card[key as keyof typeof card] as string[]).slice(0, 2).map(p => (
                                <li key={p} className="flex items-center gap-1.5 text-xs text-banking-muted">
                                  <ChevronRight className="h-3 w-3 text-banking-gold" />
                                  {p}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            card[key as keyof typeof card]
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Help/Advice Section */}
        <section className="mx-auto max-w-7xl px-5 mt-24 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-banking-blue p-12 text-white flex flex-col justify-between">
            <div>
              <h3 className="text-3xl font-bold">Unsure which card is right?</h3>
              <p className="mt-4 text-white/70">Our intelligent selector tool helps you find the perfect match based on your spending habits.</p>
            </div>
            <Link href="#" className="mt-8 inline-flex items-center gap-2 font-bold text-banking-gold hover:underline">
              Try the Card Selector Tool
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="rounded-3xl border border-banking-border bg-white p-12 flex flex-col justify-between">
            <div>
              <h3 className="text-3xl font-bold text-banking-text">Institutional Borrowing</h3>
              <p className="mt-4 text-banking-muted">Looking for commercial credit lines up to $5M? Our corporate team is ready to assist.</p>
            </div>
            <Link href="#" className="mt-8 inline-flex items-center gap-2 font-bold text-banking-blue hover:underline">
              Contact Business Solutions
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
