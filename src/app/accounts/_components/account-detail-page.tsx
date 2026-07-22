import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  FileText,
  LucideIcon,
  ShieldCheck,
} from "lucide-react";
import { SiteShell } from "@/components/public/site-shell";

export type AccountDetail = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  icon: LucideIcon;
  highlights: string[];
  stats: Array<[string, string]>;
  sections: Array<{
    title: string;
    body: string;
    bullets: string[];
  }>;
  fees: Array<[string, string]>;
  eligibility: string[];
  bestFor: string[];
  cta?: string;
};

export function AccountDetailPage({ account }: { account: AccountDetail }) {
  const Icon = account.icon;

  return (
    <SiteShell>
      <main className="bg-white">
        <section className="relative overflow-hidden border-b border-banking-border bg-banking-ink text-white">
          <img
            src={account.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-36"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,17,31,0.96)_0%,rgba(7,17,31,0.78)_52%,rgba(7,17,31,0.38)_100%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <nav className="mb-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/58">
                <Link href="/accounts" className="hover:text-banking-gold">Accounts</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-banking-gold">{account.eyebrow}</span>
              </nav>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-banking-gold/25 bg-banking-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-banking-gold">
                {account.eyebrow}
              </div>
              <h1 className="max-w-4xl text-5xl font-semibold leading-tight tracking-normal md:text-6xl">
                {account.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-white/76">
                {account.description}
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/accounts/apply"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-banking-gold px-8 py-4 text-xs font-bold uppercase tracking-[0.16em] text-banking-ink transition hover:bg-white"
                >
                  {account.cta ?? "Start application"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-8 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white/20"
                >
                  Talk to an advisor
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[2rem] border border-white/15 bg-white p-6 text-banking-ink shadow-2xl">
                <div className="flex items-start justify-between gap-6 border-b border-banking-border pb-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-banking-muted">Account snapshot</p>
                    <h2 className="mt-2 text-2xl font-semibold">{account.eyebrow}</h2>
                  </div>
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-banking-blue text-white">
                    <Icon className="h-7 w-7" />
                  </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {account.stats.map(([value, label]) => (
                    <div key={label} className="rounded-xl bg-banking-offWhite p-4">
                      <p className="text-2xl font-semibold text-banking-blue">{value}</p>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-banking-muted">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 space-y-3">
                  {account.highlights.map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-xl border border-banking-border bg-white p-4">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                      <p className="text-sm font-medium leading-6 text-banking-text">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-banking-blue">Details</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-normal text-banking-ink">
                Designed for real banking habits.
              </h2>
              <p className="mt-5 text-sm font-medium leading-7 text-banking-muted">
                Every CDNT account is built around secure digital access,
                transparent fees, advisor support, and smooth movement between
                everyday money, savings, and supported digital asset workflows.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {account.sections.map((section) => (
                <article key={section.title} className="rounded-2xl border border-banking-border bg-white p-7 shadow-sm">
                  <h3 className="text-xl font-semibold text-banking-ink">{section.title}</h3>
                  <p className="mt-3 text-sm font-medium leading-7 text-banking-muted">{section.body}</p>
                  <ul className="mt-6 space-y-3">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3 text-sm font-medium text-banking-text">
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-banking-gold" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-banking-offWhite py-20">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-3">
            <div className="rounded-2xl border border-banking-border bg-white p-7">
              <FileText className="h-8 w-8 text-banking-blue" />
              <h3 className="mt-5 text-2xl font-semibold text-banking-ink">Fees and limits</h3>
              <div className="mt-6 divide-y divide-banking-border">
                {account.fees.map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-6 py-4 text-sm">
                    <span className="font-medium text-banking-muted">{label}</span>
                    <span className="text-right font-semibold text-banking-ink">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-banking-border bg-white p-7">
              <ShieldCheck className="h-8 w-8 text-emerald-600" />
              <h3 className="mt-5 text-2xl font-semibold text-banking-ink">Eligibility</h3>
              <ul className="mt-6 space-y-4">
                {account.eligibility.map((item) => (
                  <li key={item} className="flex gap-3 text-sm font-medium leading-6 text-banking-muted">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-banking-ink p-7 text-white">
              <h3 className="text-2xl font-semibold">Best for</h3>
              <ul className="mt-6 space-y-4">
                {account.bestFor.map((item) => (
                  <li key={item} className="flex gap-3 text-sm font-medium leading-6 text-white/72">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-banking-gold" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/accounts/faq" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-banking-gold">
                Review account FAQs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
