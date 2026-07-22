import Link from "next/link";
import { 
  CheckCircle2, 
  ChevronRight, 
  Smartphone, 
  Globe, 
  CreditCard, 
  ShieldCheck,
  CircleDollarSign,
  Info,
  Landmark
} from "lucide-react";
import { SiteShell } from "@/components/public/site-shell";

export default function AdvantageBankingPage() {
  return (
    <SiteShell>
      {/* Product Hero */}
      <section className="bg-white border-b border-banking-border">
        <div className="mx-auto max-w-7xl px-5 py-16 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-banking-muted mb-6">
              <Link href="/accounts" className="hover:text-banking-blue">Accounts</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-banking-blue">Advantage Banking</span>
            </nav>
            <h1 className="text-4xl font-bold text-banking-text md:text-5xl">CDNT Advantage Banking</h1>
            <p className="mt-6 text-xl text-banking-muted leading-relaxed">
              Our most versatile chequing account designed for your daily life. Unlimited transactions, no monthly fee with a minimum balance, and premium security.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link 
                href="/register"
                className="rounded-md bg-banking-blue px-8 py-4 font-bold text-white hover:bg-banking-navy transition-all shadow-lg shadow-banking-blue/20"
              >
                Open Account Now
              </Link>
              <button className="rounded-md border border-banking-border bg-white px-8 py-4 font-bold text-banking-text hover:border-banking-blue transition-all">
                Book an Appointment
              </button>
            </div>
            <p className="mt-6 text-xs text-banking-muted flex items-center gap-2">
              <Info className="h-4 w-4" />
              Earn a $350 bonus when you open an account by June 30th. Conditions apply.
            </p>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-banking-offWhite overflow-hidden border border-banking-border shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1470" 
                alt="Mobile Banking" 
                className="h-full w-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-banking-blue/20 to-transparent" />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 rounded-xl bg-white p-6 shadow-xl border border-banking-border animate-bounce-slow">
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-banking-muted uppercase">Monthly Fee</p>
                  <p className="text-xl font-bold text-banking-text">$0.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-24 bg-banking-offWhite">
        <div className="mx-auto max-w-7xl px-5">
          <h2 className="text-center text-3xl font-bold text-banking-text">Why choose Advantage Banking?</h2>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Unlimited Transactions",
                description: "Enjoy unlimited debit transactions and Interac e-Transfers within Canada.",
                icon: CircleDollarSign
              },
              {
                title: "Mobile Banking Excellence",
                description: "Deposit cheques, pay bills, and manage your budget with our top-rated mobile app.",
                icon: Smartphone
              },
              {
                title: "International Transfers",
                description: "Send money globally with competitive rates and zero CDNT transfer fees.",
                icon: Globe
              },
              {
                title: "No Fee with Balance",
                description: "The $11.95 monthly fee is waived with a minimum daily balance of $4,000.",
                icon: CheckCircle2
              },
              {
                title: "Premium Security",
                description: "Protected by the CDNT Security Guarantee and 24/7 fraud monitoring.",
                icon: ShieldCheck
              },
              {
                title: "CDNT Vantage",
                description: "Access exclusive rewards, partner offers, and value-added services automatically.",
                icon: Landmark
              }
            ].map((benefit) => (
              <div key={benefit.title} className="bg-white p-8 rounded-xl border border-banking-border shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-6 grid h-12 w-12 place-items-center rounded-lg bg-blue-50 text-banking-blue">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-banking-text">{benefit.title}</h3>
                <p className="mt-3 text-sm text-banking-muted leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-5">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-banking-text">Fees and Features</h2>
            <p className="mt-4 text-banking-muted">Everything you need to know about your new account.</p>
          </div>
          <div className="overflow-hidden rounded-xl border border-banking-border">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-banking-offWhite">
                  <th className="px-6 py-4 text-sm font-bold text-banking-text border-b border-banking-border">Feature</th>
                  <th className="px-6 py-4 text-sm font-bold text-banking-text border-b border-banking-border">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-banking-border">
                <tr>
                  <td className="px-6 py-4 text-sm font-semibold text-banking-text">Monthly Fee</td>
                  <td className="px-6 py-4 text-sm text-banking-muted">$11.95 (Waived with $4,000 balance)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-semibold text-banking-text">Debit Transactions</td>
                  <td className="px-6 py-4 text-sm text-banking-muted">Unlimited</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-semibold text-banking-text">Interac e-Transfer</td>
                  <td className="px-6 py-4 text-sm text-banking-muted">Unlimited (Free)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-semibold text-banking-text">Non-CDNT ATM</td>
                  <td className="px-6 py-4 text-sm text-banking-muted">$2.00 in Canada, $5.00 International</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-semibold text-banking-text">Personalized Cheques</td>
                  <td className="px-6 py-4 text-sm text-banking-muted">First order free (50 cheques)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="py-20 bg-banking-blue text-white">
        <div className="mx-auto max-w-7xl px-5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold">Still have questions?</h2>
            <p className="mt-4 text-white/80">Our financial advisors are ready to help you find the perfect banking solution.</p>
          </div>
          <div className="flex gap-4">
            <button className="rounded-md bg-white px-8 py-3 font-bold text-banking-blue hover:bg-banking-offWhite transition-colors">
              Chat with Us
            </button>
            <button className="rounded-md border border-white/20 bg-white/10 px-8 py-3 font-bold text-white hover:bg-white/20 transition-colors">
              FAQ Center
            </button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
