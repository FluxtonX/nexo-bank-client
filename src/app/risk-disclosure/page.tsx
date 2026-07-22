import { SiteShell } from "@/components/public/site-shell";
import { AlertTriangle, TrendingDown, Zap, ShieldAlert, History } from "lucide-react";

export default function RiskDisclosurePage() {
  return (
    <SiteShell>
      <section className="bg-banking-ink py-16 text-white">
        <div className="mx-auto max-w-4xl px-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-amber-500 mb-6">
            <AlertTriangle className="h-3.5 w-3.5" />
            High Risk Warning
          </div>
          <h1 className="text-4xl font-black">Risk Disclosure Statement</h1>
          <p className="mt-4 text-sm font-bold text-white/40 uppercase tracking-widest">Effective Date: May 15, 2026</p>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-5 py-20">
        <div className="prose prose-blue max-w-none">
          <p className="text-lg font-bold text-banking-text leading-relaxed mb-12">
            The trading and holding of digital assets (cryptocurrencies) involve significant risk. You should carefully consider whether such activity is suitable for you in light of your financial condition.
          </p>

          <div className="space-y-16">
            <section>
              <h2 className="flex items-center gap-3 text-2xl font-bold text-banking-text mb-6">
                <TrendingDown className="h-6 w-6 text-red-500" />
                1. Market Volatility
              </h2>
              <p className="text-banking-muted leading-relaxed">
                Digital asset prices are highly volatile and can fluctuate significantly in very short periods. You may lose some or all of your invested capital. Market prices can be influenced by factors such as regulatory changes, technical developments, or overall market sentiment.
              </p>
            </section>

            <section>
              <h2 className="flex items-center gap-3 text-2xl font-bold text-banking-text mb-6">
                <Zap className="h-6 w-6 text-banking-gold" />
                2. Technical & Network Risks
              </h2>
              <div className="space-y-4">
                <div className="rounded-xl border border-banking-border p-6 bg-white">
                  <h3 className="font-bold mb-2">Irreversibility of Transactions</h3>
                  <p className="text-sm text-banking-muted leading-relaxed">Transactions broadcast to the blockchain are final. Sending assets to an incorrect address or using an unsupported network may result in the permanent loss of funds.</p>
                </div>
                <div className="rounded-xl border border-banking-border p-6 bg-white">
                  <h3 className="font-bold mb-2">Blockchain Congestion</h3>
                  <p className="text-sm text-banking-muted leading-relaxed">Network congestion may result in delayed transaction confirmations and significantly higher network fees (gas fees), which are beyond the control of CDNT.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="flex items-center gap-3 text-2xl font-bold text-banking-text mb-6">
                <ShieldAlert className="h-6 w-6 text-banking-blue" />
                3. Custody & Security Risks
              </h2>
              <p className="text-banking-muted leading-relaxed">
                While CDNT employs institutional-grade security, no system is entirely immune to cyber-attacks, software bugs, or technical failures. Unauthorized access to your account (e.g., through a compromised 2FA device) could result in the loss of your assets.
              </p>
            </section>

            <section>
              <h2 className="flex items-center gap-3 text-2xl font-bold text-banking-text mb-6">
                <History className="h-6 w-6 text-banking-gold" />
                4. Regulatory Risks
              </h2>
              <p className="text-banking-muted leading-relaxed">
                The regulatory environment for digital assets is evolving. Future legislative or regulatory changes may adversely affect the use, transfer, exchange, and value of digital assets. CDNT may be required to restrict services in certain jurisdictions to comply with local laws.
              </p>
            </section>

            <div className="rounded-3xl border-2 border-red-100 bg-red-50 p-10 text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-red-600 mb-6" />
              <h2 className="text-2xl font-bold text-red-900 mb-4">No Financial Advice</h2>
              <p className="text-sm leading-7 text-red-900/70 max-w-2xl mx-auto">
                All content on the CDNT platform is for informational purposes only and does not constitute financial, investment, or legal advice. You should consult with a qualified professional before making any financial decisions.
              </p>
            </div>
          </div>
        </div>
      </main>
    </SiteShell>
  );
}

