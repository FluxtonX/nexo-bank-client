import Link from "next/link";
import { SiteShell } from "@/components/public/site-shell";
import { SimpleHeroSlider } from "@/components/public/simple-hero-slider";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  BarChart3,
  Building2,
  CircleDollarSign,
  FileCheck2,
  Globe2,
  Landmark,
  LineChart,
  LockKeyhole,
  Network,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

const institutionalImages = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070",
  "https://images.unsplash.com/photo-1560472355-536de3962603?auto=format&fit=crop&q=80&w=2070",
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=2070",
];

const mandates = [
  {
    title: "Asset Managers",
    body: "Portfolio liquidity, reporting, operational banking, and multi-currency transaction workflows.",
    icon: LineChart,
  },
  {
    title: "Family Offices",
    body: "Consolidated reporting, treasury visibility, private capital workflows, and secure account controls.",
    icon: UsersRound,
  },
  {
    title: "Corporations",
    body: "Liquidity management, commercial deposits, risk controls, and high-touch advisory support.",
    icon: Building2,
  },
  {
    title: "Foundations",
    body: "Governance-ready statements, controlled disbursements, and long-term reserve visibility.",
    icon: BadgeCheck,
  },
];

export default function InstitutionalPage() {
  return (
    <SiteShell>
      <main className="bg-white">
        <section className="relative overflow-hidden pt-28 pb-24 text-white">
          <SimpleHeroSlider images={institutionalImages} overlayOpacity={0.82} />
          <div className="mx-auto max-w-7xl px-5">
            <div className="relative z-10 max-w-4xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-banking-gold">
                Institutional Banking
              </div>
              <h1 className="text-5xl font-bold leading-tight lg:text-7xl">
                Institutional strength for complex financial organizations.
              </h1>
              <p className="mt-8 max-w-3xl text-xl font-medium leading-relaxed text-white/58">
                CDNT Institutional supports asset managers, family offices,
                corporations, and foundations with secure treasury, reporting,
                liquidity, and risk-control experiences.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="rounded-lg bg-banking-gold px-8 py-4 text-sm font-bold uppercase tracking-widest text-banking-ink shadow-xl transition-all hover:bg-white"
                >
                  Speak with institutional advisory
                </Link>
                <Link
                  href="#mandates"
                  className="rounded-lg border border-white/20 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-white/10"
                >
                  Explore capabilities
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-banking-border bg-banking-offWhite py-10">
          <div className="mx-auto grid max-w-7xl gap-4 px-5 md:grid-cols-4">
            {[
              ["$18.2B", "Assets under visibility"],
              ["42", "Institutional mandates"],
              ["5", "Treasury currencies"],
              ["24/7", "Security monitoring"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-banking-border bg-white p-6 shadow-sm">
                <p className="text-3xl font-bold text-banking-blue">{value}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-widest text-banking-muted">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="mandates" className="py-24">
          <div className="mx-auto max-w-7xl px-5">
            <div className="mb-16 max-w-3xl">
              <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-banking-blue">
                Institutional Mandates
              </h2>
              <p className="mt-4 text-4xl font-bold text-banking-ink">
                A structured platform for organizations that require governance, scale, and precision.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {mandates.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[2rem] border border-banking-border bg-white p-7 shadow-sm transition-all hover:border-banking-blue hover:shadow-xl"
                >
                  <div className="mb-6 grid h-14 w-14 place-items-center rounded-xl bg-blue-50 text-banking-blue">
                    <item.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-banking-ink">{item.title}</h3>
                  <p className="mt-4 text-sm font-medium leading-relaxed text-banking-muted">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-banking-ink py-24 text-white">
          <div className="mx-auto grid max-w-7xl gap-16 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-banking-gold">
                Operating Platform
              </h2>
              <h3 className="mt-5 text-5xl font-bold leading-tight">
                One command view for liquidity, risk, custody, and reporting.
              </h3>
              <p className="mt-8 text-lg font-medium leading-relaxed text-white/50">
                Designed as a static UI today, the institutional experience
                models how large clients review cash positions, approvals,
                portfolio exposures, documents, and operational controls.
              </p>
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {[
                  ["Liquidity controls", CircleDollarSign],
                  ["Document governance", FileCheck2],
                  ["Security approvals", LockKeyhole],
                  ["Global access", Globe2],
                ].map(([label, Icon]) => (
                  <div key={label as string} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <Icon className="h-6 w-6 text-banking-gold" />
                    <p className="mt-4 font-bold">{label as string}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[3rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
              <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/35">
                    Institutional dashboard
                  </p>
                  <p className="mt-1 text-2xl font-bold">Institutional liquidity command</p>
                </div>
                <div className="rounded-2xl bg-emerald-400/10 px-4 py-3 text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/35">
                    Status
                  </p>
                  <p className="font-bold text-emerald-300">Balanced</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  ["Operating cash", "$42.8M", Banknote],
                  ["Reserve assets", "$118.4M", Landmark],
                  ["Risk alerts", "0 open", ShieldCheck],
                ].map(([label, value, Icon]) => (
                  <div key={label as string} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <Icon className="h-5 w-5 text-banking-gold" />
                    <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-white/30">
                      {label as string}
                    </p>
                    <p className="mt-1 text-xl font-bold">{value as string}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-[#070B15]">
                <div className="flex flex-col gap-4 border-b border-white/10 p-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/35">
                      Treasury optimization
                    </p>
                    <p className="mt-1 text-xl font-bold">Liquidity forecast and exposure mix</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      ["VaR", "1.8%"],
                      ["LCR", "142%"],
                      ["FX", "5 CCY"],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-xl bg-white/[0.05] px-4 py-2">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/30">{label}</p>
                        <p className="mt-1 text-sm font-bold text-banking-gold">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid gap-6 p-5 lg:grid-cols-[1fr_180px]">
                  <div className="relative min-h-[300px] rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <svg viewBox="0 0 620 310" className="h-full min-h-[300px] w-full">
                      <defs>
                        <linearGradient id="institutionalGoldArea" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#FDC205" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#FDC205" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="institutionalBlueArea" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.22" />
                          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {[50, 100, 150, 200, 250].map((y) => (
                        <line key={y} x1="20" x2="600" y1={y} y2={y} stroke="rgba(255,255,255,0.06)" />
                      ))}
                      {[110, 220, 330, 440, 550].map((x) => (
                        <line key={x} x1={x} x2={x} y1="25" y2="275" stroke="rgba(255,255,255,0.035)" />
                      ))}
                      <path
                        d="M25,232 C100,210 135,182 190,150 C260,110 305,132 360,92 C430,42 500,68 590,36 L590,280 L25,280 Z"
                        fill="url(#institutionalGoldArea)"
                      />
                      <path
                        d="M25,252 C100,235 152,226 210,205 C286,176 340,194 405,154 C470,115 525,124 590,98 L590,280 L25,280 Z"
                        fill="url(#institutionalBlueArea)"
                      />
                      <path
                        d="M25,232 C100,210 135,182 190,150 C260,110 305,132 360,92 C430,42 500,68 590,36"
                        fill="none"
                        stroke="#FDC205"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M25,252 C100,235 152,226 210,205 C286,176 340,194 405,154 C470,115 525,124 590,98"
                        fill="none"
                        stroke="#38BDF8"
                        strokeWidth="4"
                        strokeLinecap="round"
                        opacity="0.95"
                      />
                      {[
                        [190, 150, "Q2"],
                        [360, 92, "Q3"],
                        [590, 36, "Q4"],
                      ].map(([x, y, label]) => (
                        <g key={label}>
                          <circle cx={x} cy={y} r="8" fill="#FDC205" stroke="#070B15" strokeWidth="4" />
                          <text x={Number(x) - 10} y={Number(y) - 18} fill="rgba(255,255,255,0.58)" fontSize="12" fontWeight="700">
                            {label}
                          </text>
                        </g>
                      ))}
                      <text x="28" y="300" fill="rgba(255,255,255,0.35)" fontSize="12" fontWeight="700">Jan</text>
                      <text x="185" y="300" fill="rgba(255,255,255,0.35)" fontSize="12" fontWeight="700">Apr</text>
                      <text x="355" y="300" fill="rgba(255,255,255,0.35)" fontSize="12" fontWeight="700">Jul</text>
                      <text x="560" y="300" fill="rgba(255,255,255,0.35)" fontSize="12" fontWeight="700">Dec</text>
                    </svg>
                  </div>
                  <div className="grid gap-3">
                    {[
                      ["Operating liquidity", "76%", "bg-banking-gold"],
                      ["Reserve buffer", "18%", "bg-sky-400"],
                      ["Settlement float", "6%", "bg-emerald-400"],
                    ].map(([label, value, color]) => (
                      <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                          <span className="text-xl font-bold">{value}</span>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/35">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto max-w-7xl px-5">
            <div className="grid gap-8 lg:grid-cols-3">
              {[
                {
                  title: "Treasury & Liquidity",
                  body: "Cash concentration, multi-currency visibility, internal approvals, and daily position monitoring.",
                  icon: BarChart3,
                },
                {
                  title: "Risk & Governance",
                  body: "Structured controls for account restrictions, audit trails, security reviews, and operational policies.",
                  icon: ShieldCheck,
                },
                {
                  title: "Network Access",
                  body: "Global operating model for institutional teams, advisors, signatories, and reporting stakeholders.",
                  icon: Network,
                },
              ].map((item) => (
                <article key={item.title} className="rounded-[2rem] border border-banking-border bg-banking-offWhite p-8">
                  <item.icon className="h-8 w-8 text-banking-blue" />
                  <h3 className="mt-6 text-2xl font-bold text-banking-ink">{item.title}</h3>
                  <p className="mt-4 text-sm font-medium leading-relaxed text-banking-muted">
                    {item.body}
                  </p>
                  <button className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-banking-blue">
                    Learn more <ArrowRight className="h-3 w-3" />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-banking-offWhite py-24">
          <div className="mx-auto max-w-5xl px-5 text-center">
            <h2 className="text-4xl font-bold text-banking-ink">
              Bring institutional discipline to every financial decision.
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg font-medium leading-relaxed text-banking-muted">
              Create a static but complete institutional-grade experience for
              governance, reporting, treasury, and client confidence.
            </p>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="w-full rounded-lg bg-banking-blue px-12 py-5 text-sm font-bold uppercase tracking-widest text-white shadow-xl transition-all hover:bg-banking-ink sm:w-auto"
              >
                Contact institutional team
              </Link>
              <Link
                href="/commercial"
                className="w-full rounded-lg border border-banking-border bg-white px-12 py-5 text-sm font-bold uppercase tracking-widest text-banking-ink transition-all hover:bg-banking-offWhite sm:w-auto"
              >
                View commercial banking
              </Link>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
