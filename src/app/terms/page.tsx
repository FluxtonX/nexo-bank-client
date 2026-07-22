import { SiteShell } from "@/components/public/site-shell";
import { Scale, AlertCircle, CheckCircle2 } from "lucide-react";

export default function TermsPage() {
  return (
    <SiteShell>
      <section className="bg-banking-offWhite py-16 border-b border-banking-border">
        <div className="mx-auto max-w-4xl px-5">
          <h1 className="text-4xl font-black text-banking-text">Terms of Service</h1>
          <p className="mt-4 text-sm font-bold text-banking-muted uppercase tracking-widest">Last Updated: May 15, 2026</p>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-5 py-20">
        <div className="prose prose-blue max-w-none">
          <div className="mb-12 rounded-2xl border border-amber-100 bg-amber-50 p-8 flex gap-6 items-start">
            <AlertCircle className="h-8 w-8 text-amber-600 shrink-0" />
            <div>
              <h2 className="text-lg font-bold text-amber-900 mb-2">Legal Agreement</h2>
              <p className="text-sm leading-relaxed text-amber-900/70">
                By accessing or using the CDNT platform, you agree to be bound by these Terms of Service. Please read them carefully as they contain important information regarding your legal rights, remedies, and obligations.
              </p>
            </div>
          </div>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-banking-text mb-4">1. Eligibility & Registration</h2>
              <p className="text-banking-muted leading-relaxed mb-4">
                To use CDNT, you must be at least 18 years of age and a resident of an authorized jurisdiction. You agree to provide accurate, current, and complete information during the registration process and to keep your account information updated.
              </p>
              <div className="rounded-xl bg-banking-offWhite p-6 border border-banking-border">
                <p className="text-sm font-bold text-banking-text mb-3">Key Requirements:</p>
                <ul className="space-y-2 text-sm text-banking-muted">
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" /> Successful completion of KYC/AML verification.</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" /> Maintenance of a secure, unique password and 2FA.</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" /> Immediate notification of any unauthorized access.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-banking-text mb-4">2. Digital Asset Services</h2>
              <p className="text-banking-muted leading-relaxed">
                CDNT provides interfaces for managing digital assets (crypto). We do not guarantee the value of any digital asset. You acknowledge that digital assets are volatile and carry significant risk. All transactions are final once broadcast to the blockchain.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-banking-text mb-4">3. Prohibited Activities</h2>
              <p className="text-banking-muted leading-relaxed mb-4">You agree not to engage in any of the following:</p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-banking-muted">
                <li>Using the service for money laundering or illegal financing.</li>
                <li>Attempting to bypass security measures or exploit system vulnerabilities.</li>
                <li>Engaging in market manipulation or fraudulent transaction patterns.</li>
                <li>Providing false or misleading information during identity verification.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-banking-text mb-4">4. Fees & Payments</h2>
              <p className="text-banking-muted leading-relaxed">
                Service fees are outlined in our <a href="/pricing" className="text-banking-blue font-bold hover:underline">Pricing Schedule</a>. CDNT reserves the right to adjust fees with 30 days' notice. You are responsible for all network/gas fees associated with blockchain transactions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-banking-text mb-4">5. Termination</h2>
              <p className="text-banking-muted leading-relaxed">
                We reserve the right to suspend or terminate your account at our sole discretion, without notice, if we believe you have violated these Terms or engaged in suspicious activity.
              </p>
            </section>

            <section className="pt-12 border-t border-banking-border">
              <div className="flex gap-4 p-6 rounded-2xl bg-banking-offWhite border border-banking-border">
                <Scale className="h-6 w-6 text-banking-blue shrink-0" />
                <div>
                  <p className="font-bold text-banking-text">Governing Law</p>
                  <p className="mt-1 text-sm text-banking-muted leading-relaxed">
                    These terms are governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein. Any disputes shall be settled in the courts of Toronto, Ontario.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </SiteShell>
  );
}

