import { SiteShell } from "@/components/public/site-shell";
import { Shield, Eye, Lock, FileText } from "lucide-react";

export default function PrivacyPage() {
  return (
    <SiteShell>
      <section className="bg-banking-offWhite py-16 border-b border-banking-border">
        <div className="mx-auto max-w-4xl px-5">
          <h1 className="text-4xl font-black text-banking-text">Privacy Policy</h1>
          <p className="mt-4 text-sm font-bold text-banking-muted uppercase tracking-widest">Effective Date: May 15, 2026</p>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-5 py-20">
        <div className="prose prose-blue max-w-none">
          <div className="mb-12 rounded-2xl border border-blue-100 bg-blue-50 p-8 flex gap-6 items-start">
            <Shield className="h-8 w-8 text-banking-blue shrink-0" />
            <div>
              <h2 className="text-lg font-bold text-banking-blue mb-2">Our Commitment to Privacy</h2>
              <p className="text-sm leading-relaxed text-blue-900/70">
                At CDNT, we understand that your financial privacy is paramount. This policy outlines how we collect, protect, and use your personal information and digital asset data.
              </p>
            </div>
          </div>

          <div className="space-y-16">
            <section>
              <h2 className="flex items-center gap-3 text-2xl font-bold text-banking-text mb-6">
                <FileText className="h-6 w-6 text-banking-gold" />
                1. Information We Collect
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-banking-border p-6 bg-white">
                  <h3 className="font-bold mb-2">Identity & KYC</h3>
                  <p className="text-sm text-banking-muted leading-relaxed">Full name, date of birth, government-issued identification, and biometric data for liveness verification.</p>
                </div>
                <div className="rounded-xl border border-banking-border p-6 bg-white">
                  <h3 className="font-bold mb-2">Financial Data</h3>
                  <p className="text-sm text-banking-muted leading-relaxed">Transaction history, wallet addresses, bank account details for Interac e-Transfers, and portfolio balances.</p>
                </div>
                <div className="rounded-xl border border-banking-border p-6 bg-white">
                  <h3 className="font-bold mb-2">Technical Info</h3>
                  <p className="text-sm text-banking-muted leading-relaxed">IP address, device hardware signatures, browser type, and geolocation for security monitoring.</p>
                </div>
                <div className="rounded-xl border border-banking-border p-6 bg-white">
                  <h3 className="font-bold mb-2">Communications</h3>
                  <p className="text-sm text-banking-muted leading-relaxed">Support tickets, chat logs, and email interactions with our client service team.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="flex items-center gap-3 text-2xl font-bold text-banking-text mb-6">
                <Eye className="h-6 w-6 text-banking-gold" />
                2. How We Use Your Data
              </h2>
              <ul className="list-disc pl-6 space-y-4 text-banking-muted leading-relaxed">
                <li><strong>Service Provision:</strong> To manage your accounts, process transactions, and provide portfolio visibility.</li>
                <li><strong>Compliance:</strong> To satisfy Anti-Money Laundering (AML) and Counter-Terrorist Financing (CTF) regulations.</li>
                <li><strong>Security:</strong> To detect, prevent, and mitigate fraud, unauthorized access, and other security risks.</li>
                <li><strong>Personalization:</strong> To provide tailored financial insights and product recommendations based on your activity.</li>
              </ul>
            </section>

            <section>
              <h2 className="flex items-center gap-3 text-2xl font-bold text-banking-text mb-6">
                <Lock className="h-6 w-6 text-banking-gold" />
                3. Data Security Measures
              </h2>
              <p className="text-banking-muted leading-relaxed mb-6">
                CDNT employs multi-layered security protocols to safeguard your data:
              </p>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 rounded-xl bg-banking-offWhite border border-banking-border">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2" />
                  <p className="text-sm"><strong>Encryption:</strong> AES-256 for data at rest and TLS 1.3 for data in transit.</p>
                </div>
                <div className="flex gap-4 p-4 rounded-xl bg-banking-offWhite border border-banking-border">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2" />
                  <p className="text-sm"><strong>Isolation:</strong> Private keys and sensitive KYC documents are stored in logically isolated secure environments.</p>
                </div>
                <div className="flex gap-4 p-4 rounded-xl bg-banking-offWhite border border-banking-border">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2" />
                  <p className="text-sm"><strong>Access Control:</strong> Strict Least-Privilege access for all internal staff with mandatory multi-factor authentication.</p>
                </div>
              </div>
            </section>

            <section className="pt-12 border-t border-banking-border">
              <h2 className="text-2xl font-bold text-banking-text mb-6">Contact Privacy Officer</h2>
              <p className="text-banking-muted leading-relaxed mb-6">
                If you have questions about our privacy practices, or wish to exercise your data rights (access, deletion, correction), please contact us at:
              </p>
              <div className="rounded-2xl border border-banking-border bg-white p-8">
                <p className="font-bold text-banking-text">Privacy & Data Protection Office</p>
                <p className="text-sm text-banking-muted mt-1">CDNT Financial Services Inc.</p>
                <p className="text-sm text-banking-muted">privacy@cdnt.io</p>
                <p className="text-sm text-banking-muted mt-4">1200 Bay St, Toronto, ON M5R 2A5, Canada</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </SiteShell>
  );
}

