import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Globe2,
  GraduationCap,
  Landmark,
  PiggyBank,
  ShieldCheck,
  WalletCards,
  Zap,
} from "lucide-react";
import { SiteShell } from "@/components/public/site-shell";

const accountFamilies = [
  {
    title: "Chequing Accounts",
    href: "/accounts/chequing-accounts",
    icon: WalletCards,
    description: "Daily banking for pay, bills, debit purchases, transfers, and connected portfolio activity.",
    features: ["Unlimited digital transactions", "Direct deposit and bill pay", "2FA-protected account access"],
  },
  {
    title: "Savings Accounts",
    href: "/accounts/savings-accounts",
    icon: PiggyBank,
    description: "Goal-based savings for emergency funds, reserves, planned purchases, and liquidity discipline.",
    features: ["No-fee savings options", "Automated goal transfers", "Clear interest and progress tracking"],
  },
  {
    title: "International Banking",
    href: "/accounts/international-banking",
    icon: Globe2,
    description: "Support for travel, foreign payments, global transfers, and cross-border cash-flow planning.",
    features: ["International transfer guidance", "Travel-ready card controls", "FX and recipient review support"],
  },
  {
    title: "Student Banking",
    href: "/accounts/student-banking",
    icon: GraduationCap,
    description: "Simple account tools for students building budgeting, credit, savings, and security habits.",
    features: ["Student-friendly monthly fee", "Budget and alert tools", "Credit and crypto education"],
  },
  {
    title: "Help With My Account",
    href: "/accounts/help-with-my-account",
    icon: ShieldCheck,
    description: "Get help with login, cards, transactions, statements, documents, deposits, and withdrawals.",
    features: ["Secure support tickets", "KYC document help", "BTC, ETH, and USDT workflow support"],
  },
  {
    title: "NUB Vantage",
    href: "/accounts/nub-vantage",
    icon: Landmark,
    description: "Premium relationship banking with priority service, richer insights, and portfolio visibility.",
    features: ["Priority advisor access", "Cash and crypto portfolio insights", "Premium account benefits"],
  },
];

const dropdownActions = [
  {
    title: "Current Rates",
    href: "/accounts/current-rates",
    body: "Review sample monthly fees, savings rates, waivers, service pricing, and crypto network notices.",
    icon: CircleDollarSign,
  },
  {
    title: "Apply Online",
    href: "/accounts/apply",
    body: "Start secure onboarding with profile setup, identity verification, account selection, and 2FA.",
    icon: Zap,
  },
  {
    title: "Frequently Asked Questions",
    href: "/accounts/faq",
    body: "Get clear answers about account choice, KYC, fees, student eligibility, support, and crypto workflows.",
    icon: CheckCircle2,
  },
];

export default function AccountsOverviewPage() {
  return (
    <SiteShell>
      <main className="bg-white">
        <section className="relative overflow-hidden bg-banking-ink text-white">
          <img
            src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=2200"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-36"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,17,31,0.96)_0%,rgba(7,17,31,0.78)_50%,rgba(7,17,31,0.36)_100%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-banking-gold/25 bg-banking-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-banking-gold">
                View Accounts details
              </div>
              <h1 className="mt-7 max-w-4xl text-5xl font-semibold leading-tight tracking-normal md:text-6xl">
                Accounts built around everyday banking and modern wealth movement.
              </h1>
              <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-white/76">
                Compare CDNT chequing, savings, student, international,
                support, and Vantage account options in one place. Each account is
                designed for secure onboarding, clear pricing, digital access, and
                connected portfolio workflows including supported crypto assets.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/accounts/apply"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-banking-gold px-8 py-4 text-xs font-bold uppercase tracking-[0.16em] text-banking-ink transition hover:bg-white"
                >
                  Apply online
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/accounts/current-rates"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-8 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white/20"
                >
                  View current rates
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/15 bg-white p-6 text-banking-ink shadow-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-banking-muted">Account match</p>
              <h2 className="mt-2 text-2xl font-semibold">Choose by how you use money</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  ["Daily spending", "Chequing"],
                  ["Cash reserves", "Savings"],
                  ["School budget", "Student"],
                  ["Premium service", "Vantage"],
                ].map(([need, account]) => (
                  <div key={need} className="rounded-xl border border-banking-border bg-banking-offWhite p-4">
                    <p className="text-sm font-semibold text-banking-ink">{need}</p>
                    <p className="mt-1 text-xs font-medium text-banking-muted">{account}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-xl bg-banking-ink p-5 text-white">
                <p className="text-sm font-medium leading-7 text-white/76">
                  Start with cash-flow needs first, then compare fees, support level,
                  savings goals, international access, and crypto workflow requirements.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-banking-border bg-banking-offWhite py-10">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 md:grid-cols-4">
            {[
              ["6", "Account paths"],
              ["$0", "Student and savings options"],
              ["2FA", "Sensitive action protection"],
              ["BTC", "ETH and USDT support"],
            ].map(([value, label]) => (
              <div key={label} className="border-l border-banking-blue/15 pl-5">
                <p className="text-3xl font-semibold text-banking-blue">{value}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-banking-muted">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-5">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-banking-blue">Account options</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-normal text-banking-ink">
                Pick the account detail page that matches your need.
              </h2>
              <p className="mt-5 text-sm font-medium leading-7 text-banking-muted">
                These are unique account pages, so users do not land on duplicate
                content unless the dropdown action is intentionally returning them
                to this overview.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {accountFamilies.map((account) => (
                <article key={account.title} className="flex flex-col rounded-2xl border border-banking-border bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-banking-blue">
                    <account.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-banking-ink">{account.title}</h3>
                  <p className="mt-3 text-sm font-medium leading-7 text-banking-muted">{account.description}</p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {account.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm font-medium text-banking-text">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href={account.href} className="mt-8 inline-flex items-center justify-between rounded-lg bg-banking-blue px-5 py-3 text-sm font-bold text-white transition hover:bg-banking-navy">
                    View details
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-banking-offWhite py-20">
          <div className="mx-auto max-w-7xl px-5">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-banking-blue">Dropdown actions</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-normal text-banking-ink">
                  The shared Accounts dropdown pages.
                </h2>
                <p className="mt-5 text-sm font-medium leading-7 text-banking-muted">
                  These three actions are shared across the Accounts dropdown and
                  should always go to the same unique pages.
                </p>
              </div>
              <div className="grid gap-5">
                {dropdownActions.map((action) => (
                  <Link key={action.title} href={action.href} className="group rounded-2xl border border-banking-border bg-white p-6 shadow-sm transition hover:border-banking-blue hover:shadow-xl">
                    <div className="flex items-start gap-5">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-banking-blue text-white">
                        <action.icon className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xl font-semibold text-banking-ink">{action.title}</h3>
                        <p className="mt-2 text-sm font-medium leading-7 text-banking-muted">{action.body}</p>
                        <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-banking-blue">
                          Open page
                          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
