import Link from "next/link";
import { ArrowRight, CheckCircle2, LucideIcon, ShieldCheck } from "lucide-react";

export function PublicHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="bg-white">
      <div className="mx-auto grid min-h-[560px] max-w-7xl items-center gap-10 px-5 py-16 lg:grid-cols-[1fr_0.82fr]">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-banking-blue">
            {eyebrow}
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-normal text-banking-text md:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-banking-muted">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-md bg-banking-blue px-5 py-3 text-sm font-semibold text-white shadow-glow"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/security"
              className="inline-flex items-center gap-2 rounded-md border border-banking-border bg-white px-5 py-3 text-sm font-semibold text-banking-text"
            >
              Security
              <ShieldCheck className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="rounded-lg border border-banking-border bg-banking-offWhite p-5 shadow-sm">
          <div className="rounded-md bg-auth-radial p-6 text-white">
            <p className="text-sm text-white/70">Portfolio snapshot</p>
            <p className="mt-3 text-4xl font-semibold">$105,740.46</p>
            <div className="mt-8 space-y-3">
              {["BTC allocation", "ETH allocation", "USDT allocation"].map(
                (item, index) => (
                  <div key={item}>
                    <div className="mb-2 flex justify-between text-sm text-white/76">
                      <span>{item}</span>
                      <span>{[52, 31, 17][index]}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/12">
                      <div
                        className="h-2 rounded-full bg-banking-gold"
                        style={{ width: `${[52, 31, 17][index]}%` }}
                      />
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProductPreview() {
  return (
    <div className="rounded-lg border border-banking-border bg-banking-offWhite p-4 shadow-sm">
      <div className="overflow-hidden rounded-md bg-auth-radial text-white shadow-glow">
        <div className="flex items-center justify-between border-b border-white/12 px-5 py-4">
          <div>
            <p className="text-sm text-white/66">CDNT dashboard</p>
            <p className="mt-1 font-semibold">Verified client workspace</p>
          </div>
          <span className="rounded-full bg-emerald-400/18 px-2.5 py-1 text-xs font-semibold text-emerald-100">
            KYC approved
          </span>
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="text-sm text-white/66">Total portfolio</p>
            <p className="mt-2 text-5xl font-semibold">$105,740</p>
            <p className="mt-2 text-sm text-emerald-200">+$5,210.18 this month</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {["BTC", "ETH", "USDT"].map((asset, index) => (
                <div key={asset} className="rounded-md bg-white/10 p-3">
                  <p className="text-xs text-white/62">{asset}</p>
                  <p className="mt-1 font-semibold">{[52, 31, 17][index]}%</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {["Email verified", "2FA enabled", "Withdrawal review"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-md bg-white/10 p-3 text-sm">
                <CheckCircle2 className="h-4 w-4 text-banking-gold" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-banking-blue">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-normal text-banking-text md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-banking-muted">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function FeatureGrid({
  items,
}: {
  items: Array<{ title: string; body: string; icon: LucideIcon }>;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <article
            key={item.title}
            className="rounded-lg border border-banking-border bg-white p-5 shadow-sm"
          >
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-md bg-blue-50 text-banking-blue">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-banking-text">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-banking-muted">
              {item.body}
            </p>
          </article>
        );
      })}
    </div>
  );
}

export function StatsBand() {
  return (
    <section className="bg-banking-blue text-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-12 md:grid-cols-4">
        {[
          ["3", "Supported MVP assets"],
          ["2FA", "Sensitive action protection"],
          ["24/7", "Support-ready workflows"],
          ["NUB", "Institutional Architecture"],
        ].map(([value, label]) => (
          <div key={label} className="border-l border-white/10 pl-5">
            <p className="text-4xl font-black text-banking-gold">{value}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-white/50">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}




export function HowItWorks() {
  const steps = [
    ["Create account", "Register with verified email, phone, and secure password."],
    ["Complete KYC", "Submit identity, address, documents, and verification consent."],
    ["Deposit crypto", "Use BTC, ETH, or USDT deposit screens with network warnings."],
    ["Track and withdraw", "Monitor portfolio performance and request Interac withdrawals."],
  ];

  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <SectionHeader
        eyebrow="How It Works"
        title="A calm financial workflow from onboarding to withdrawal"
      />
      <div className="mt-10 grid gap-4 md:grid-cols-4">
        {steps.map(([title, body], index) => (
          <article key={title} className="rounded-lg border border-banking-border bg-white p-5 shadow-sm">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-banking-blue text-sm font-semibold text-white">
              {index + 1}
            </div>
            <h3 className="mt-5 font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-banking-muted">{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function FaqSection() {
  const faqs = [
    ["Is this real banking?", "The MVP is a fintech SaaS interface with secure workflows. Regulated money movement and custody require licensed providers."],
    ["Which assets are supported?", "BTC, ETH, and USDT are included for the first MVP experience."],
    ["How do withdrawals work?", "Users submit Interac withdrawal requests that move through review, approval, processing, and completion states."],
    ["Can the platform scale later?", "Yes. The UI and architecture are prepared for external KYC, custody, pricing, notifications, and reporting providers."],
  ];

  return (
    <section className="mx-auto max-w-5xl px-5 py-16">
      <SectionHeader eyebrow="FAQ" title="Clear answers before signup" />
      <div className="mt-10 space-y-3">
        {faqs.map(([question, answer]) => (
          <article key={question} className="rounded-lg border border-banking-border bg-white p-5 shadow-sm">
            <h3 className="font-semibold">{question}</h3>
            <p className="mt-2 text-sm leading-6 text-banking-muted">{answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <div className="rounded-lg bg-auth-radial p-8 text-white shadow-glow md:p-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-banking-gold">
              Start secure onboarding
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-normal md:text-4xl">
              Build confidence before deposits, portfolio tracking, and withdrawals.
            </h2>
          </div>
          <Link
            href="/register"
            className="inline-flex w-fit items-center gap-2 rounded-md bg-banking-gold px-5 py-3 text-sm font-semibold text-banking-ink"
          >
            Create account
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
