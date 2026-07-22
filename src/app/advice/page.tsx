import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Calculator,
  CheckCircle2,
  ChevronRight,
  Coins,
  FileText,
  Goal,
  GraduationCap,
  Home,
  Landmark,
  LifeBuoy,
  LockKeyhole,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users2,
  WalletCards,
} from "lucide-react";
import { SiteShell } from "@/components/public/site-shell";

const lifeMoments = [
  {
    title: "Starting out",
    body: "Build a fee-aware account setup, emergency fund, and first investment plan without guessing what comes next.",
    icon: GraduationCap,
  },
  {
    title: "Buying a home",
    body: "Compare down payment paths, mortgage affordability, credit readiness, and cash reserves in one planning review.",
    icon: Home,
  },
  {
    title: "Growing wealth",
    body: "Align registered accounts, managed portfolios, and crypto exposure with your horizon and risk capacity.",
    icon: TrendingUp,
  },
  {
    title: "Building a business",
    body: "Plan cash flow, operating accounts, merchant payments, payroll, and treasury reserves as your company scales.",
    icon: BriefcaseBusiness,
  },
];

const guidanceTracks = [
  {
    title: "Everyday Banking",
    detail: "Account selection, monthly cash flow, debt payoff, credit health, and automated savings.",
    icon: WalletCards,
    links: ["Choose the right account", "Improve cash flow", "Prepare for major expenses"],
  },
  {
    title: "Investing & Retirement",
    detail: "Goal-based portfolios, contribution strategy, risk profiling, and drawdown planning.",
    icon: PiggyBank,
    links: ["Set an investment goal", "Review your allocation", "Plan retirement income"],
  },
  {
    title: "Crypto Portfolio Guidance",
    detail: "BTC, ETH, and USDT allocation education with custody hygiene, volatility planning, and withdrawal discipline.",
    icon: Coins,
    links: ["Understand crypto risk", "Review allocation limits", "Secure deposits and withdrawals"],
  },
  {
    title: "Security & Protection",
    detail: "2FA habits, device reviews, scam awareness, document safety, and beneficiary readiness.",
    icon: ShieldCheck,
    links: ["Run a security checkup", "Protect your identity", "Review trusted devices"],
  },
];

const tools = [
  {
    title: "Portfolio health scan",
    body: "See concentration, liquidity, and volatility signals across cash, investments, BTC, ETH, and USDT.",
    icon: BarChart3,
  },
  {
    title: "Savings goal planner",
    body: "Model monthly contributions for emergency funds, home deposits, education, or large purchases.",
    icon: Calculator,
  },
  {
    title: "Advisor review checklist",
    body: "Prepare documents, questions, balances, and life changes before a branch, phone, or video review.",
    icon: FileText,
  },
];

const insights = [
  {
    tag: "Guide",
    title: "How much crypto belongs in a balanced portfolio?",
    body: "A practical framework for sizing BTC and ETH exposure around income stability, time horizon, and loss tolerance.",
  },
  {
    tag: "Checklist",
    title: "Your annual financial review in 30 minutes",
    body: "The key questions to ask about fees, savings rate, portfolio drift, debt, insurance, beneficiaries, and security.",
  },
  {
    tag: "Explainer",
    title: "Cash, stablecoins, and liquidity reserves",
    body: "When to keep funds in traditional accounts, when digital settlement may help, and where risk controls matter.",
  },
];

export default function AdvicePage() {
  return (
    <SiteShell>
      <main className="bg-white">
        <section className="relative overflow-hidden bg-banking-ink text-white">
          <img
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2200"
            alt="Advisor reviewing a financial plan"
            className="absolute inset-0 h-full w-full object-cover opacity-42"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,17,31,0.96)_0%,rgba(7,17,31,0.78)_48%,rgba(7,17,31,0.44)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(253,194,5,0.18),transparent_28%)]" />

          <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-12 px-5 py-24 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-banking-gold/25 bg-banking-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-banking-gold">
                CDNT Advice
              </div>
              <h1 className="mt-7 text-5xl font-semibold leading-tight tracking-normal md:text-6xl">
                Advice for money, markets, and digital assets.
              </h1>
              <p className="mt-7 max-w-2xl text-lg font-medium leading-8 text-white/76">
                Make confident decisions with guided planning for banking, investing,
                wealth building, and crypto portfolio risk. Meet an advisor, use
                planning tools, or explore focused guidance built around your next move.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-banking-gold px-8 py-4 text-xs font-bold uppercase tracking-[0.16em] text-banking-ink shadow-xl transition hover:bg-white"
                >
                  Book an advisor review
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="#guidance"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-8 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur transition hover:bg-white/20"
                >
                  Explore guidance
                </Link>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative ml-auto max-w-[520px] rounded-[2rem] border border-white/15 bg-white p-6 text-banking-ink shadow-2xl">
                <div className="flex items-center justify-between border-b border-banking-border pb-5">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-banking-muted">Financial picture</p>
                    <p className="mt-1 text-2xl font-semibold">Goal readiness review</p>
                  </div>
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-banking-blue text-white">
                    <Goal className="h-6 w-6" />
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {[
                    ["Emergency reserve", "82%", "bg-emerald-500"],
                    ["Portfolio alignment", "74%", "bg-banking-blue"],
                    ["Crypto risk guardrail", "61%", "bg-banking-gold"],
                  ].map(([label, value, color]) => (
                    <div key={label}>
                      <div className="mb-2 flex items-center justify-between text-xs font-bold">
                        <span>{label}</span>
                        <span className="text-banking-muted">{value}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-banking-offWhite">
                        <div className={`h-full rounded-full ${color}`} style={{ width: value }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    ["BTC", "Measured"],
                    ["ETH", "Growth"],
                    ["USDT", "Liquidity"],
                  ].map(([asset, stance]) => (
                    <div key={asset} className="rounded-xl border border-banking-border bg-banking-offWhite p-4">
                      <p className="text-lg font-semibold">{asset}</p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-banking-muted">{stance}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-xl bg-banking-ink p-5 text-white">
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-banking-gold" />
                    <p className="text-sm font-semibold leading-6 text-white/82">
                      Your next review should focus on contribution rate, BTC/ETH concentration,
                      and emergency liquidity before adding risk.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-banking-border bg-banking-offWhite py-10">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 md:grid-cols-4">
            {[
              ["1:1", "Advisor reviews"],
              ["360", "Financial picture"],
              ["3", "Supported crypto assets"],
              ["24/7", "Security guidance"],
            ].map(([value, label]) => (
              <div key={label} className="border-l border-banking-blue/15 pl-5">
                <p className="text-4xl font-semibold text-banking-blue">{value}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-banking-muted">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto max-w-7xl px-5">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-banking-blue">Life moments</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-normal text-banking-ink md:text-5xl">
                Talk to us when your financial life changes.
              </h2>
              <p className="mt-5 text-base font-medium leading-8 text-banking-muted">
                A strong review is not only about products. It is about timing, goals,
                cash flow, risk, and the tradeoffs between traditional banking and digital assets.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {lifeMoments.map((item) => (
                <article key={item.title} className="rounded-2xl border border-banking-border bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-banking-blue">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-banking-ink">{item.title}</h3>
                  <p className="mt-3 text-sm font-medium leading-7 text-banking-muted">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="guidance" className="bg-banking-ink py-24 text-white">
          <div className="mx-auto max-w-7xl px-5">
            <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-banking-gold">Guidance tracks</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-normal md:text-5xl">
                  Choose the advice path that matches the decision.
                </h2>
                <p className="mt-5 text-base font-medium leading-8 text-white/62">
                  CDNT blends classic planning discipline with modern portfolio visibility,
                  so your advisor can discuss both bank accounts and digital asset behavior in context.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {guidanceTracks.map((track) => (
                  <article key={track.title} className="rounded-2xl border border-white/10 bg-white/[0.06] p-7 backdrop-blur">
                    <div className="mb-6 flex items-center gap-4">
                      <div className="grid h-12 w-12 place-items-center rounded-xl bg-banking-gold text-banking-ink">
                        <track.icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-semibold">{track.title}</h3>
                    </div>
                    <p className="text-sm font-medium leading-7 text-white/64">{track.detail}</p>
                    <ul className="mt-6 space-y-3 border-t border-white/10 pt-5">
                      {track.links.map((link) => (
                        <li key={link} className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-white/82">
                          {link}
                          <ChevronRight className="h-4 w-4 text-banking-gold" />
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto max-w-7xl px-5">
            <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-banking-blue">Review framework</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-normal text-banking-ink md:text-5xl">
                  A clear process before every recommendation.
                </h2>
                <div className="mt-10 space-y-6">
                  {[
                    ["1", "Understand your full picture", "Accounts, income, debts, holdings, crypto balances, KYC status, and upcoming obligations."],
                    ["2", "Model the goal and the risk", "Compare timelines, contribution levels, drawdowns, volatility tolerance, and liquidity needs."],
                    ["3", "Build an action plan", "Leave with prioritized next steps: account changes, savings rules, portfolio review, security hardening, or advisor follow-up."],
                  ].map(([step, title, body]) => (
                    <div key={step} className="flex gap-5">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-banking-blue text-sm font-bold text-white">
                        {step}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-banking-ink">{title}</h3>
                        <p className="mt-2 text-sm font-medium leading-7 text-banking-muted">{body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-banking-border bg-banking-offWhite p-8">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-white text-banking-blue shadow-sm">
                    <Users2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-banking-muted">Advisor access</p>
                    <h3 className="text-2xl font-semibold text-banking-ink">Meet your way</h3>
                  </div>
                </div>
                <div className="mt-8 grid gap-4">
                  {[
                    ["Video review", "For portfolio, retirement, or crypto risk planning."],
                    ["Branch appointment", "For complex account, credit, and document needs."],
                    ["Secure support ticket", "For follow-ups, statements, withdrawals, and service requests."],
                  ].map(([title, body]) => (
                    <div key={title} className="rounded-xl border border-banking-border bg-white p-5">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                        <div>
                          <p className="font-semibold text-banking-ink">{title}</p>
                          <p className="mt-1 text-sm font-medium leading-6 text-banking-muted">{body}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-banking-offWhite py-24">
          <div className="mx-auto max-w-7xl px-5">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-banking-blue">Tools & education</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-normal text-banking-ink md:text-5xl">
                  Practical tools, not vague tips.
                </h2>
              </div>
              <Link href="/help" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-banking-blue">
                Visit help center
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {tools.map((tool) => (
                <article key={tool.title} className="rounded-2xl border border-banking-border bg-white p-8 shadow-sm">
                  <div className="grid h-14 w-14 place-items-center rounded-xl bg-banking-blue text-white">
                    <tool.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-7 text-2xl font-semibold text-banking-ink">{tool.title}</h3>
                  <p className="mt-3 text-sm font-medium leading-7 text-banking-muted">{tool.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto max-w-7xl px-5">
            <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-banking-blue">Latest insights</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-normal text-banking-ink">
                  Read before you decide.
                </h2>
                <p className="mt-5 text-sm font-medium leading-7 text-banking-muted">
                  Short, focused explainers for clients who want to understand the reasoning
                  behind a recommendation before taking action.
                </p>
              </div>

              <div className="grid gap-5">
                {insights.map((item) => (
                  <article key={item.title} className="group rounded-2xl border border-banking-border bg-white p-7 shadow-sm transition hover:border-banking-blue hover:shadow-xl">
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-banking-gold">{item.tag}</p>
                        <h3 className="mt-2 text-2xl font-semibold text-banking-ink">{item.title}</h3>
                        <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-banking-muted">{item.body}</p>
                      </div>
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-banking-offWhite text-banking-blue transition group-hover:bg-banking-blue group-hover:text-white">
                        <BookOpen className="h-5 w-5" />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-banking-ink py-24 text-white">
          <div className="mx-auto max-w-5xl px-5 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-banking-gold text-banking-ink">
              <Landmark className="h-8 w-8" />
            </div>
            <h2 className="mt-8 text-4xl font-semibold tracking-normal md:text-5xl">
              Bring your next decision to CDNT.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-8 text-white/62">
              Whether you are opening your first account, adjusting your portfolio,
              planning a withdrawal, or deciding how much crypto risk is appropriate,
              start with a structured review.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/contact" className="rounded-lg bg-banking-gold px-9 py-4 text-xs font-bold uppercase tracking-[0.16em] text-banking-ink transition hover:bg-white">
                Book a review
              </Link>
              <Link href="/risk-disclosure" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-9 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white/20">
                Crypto risk disclosure
                <LockKeyhole className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-banking-border bg-white py-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 text-xs font-medium leading-6 text-banking-muted md:flex-row md:items-center md:justify-between">
            <p>
              Educational content is general information, not individualized tax, legal, investment, or custody advice.
            </p>
            <div className="flex items-center gap-2 text-banking-blue">
              <LifeBuoy className="h-4 w-4" />
              <span className="font-semibold uppercase tracking-[0.16em]">Support-ready guidance</span>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
