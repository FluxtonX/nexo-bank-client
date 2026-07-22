import { CheckCircle2, Copy, ShieldCheck } from "lucide-react";
import { PageTitle, Panel } from "@/components/dashboard/blocks";
import { StatusBadge } from "@/components/ui/status-badge";

export default function TransactionDetailPage() {
  return (
    <>
      <PageTitle
        title="Transaction Detail"
        description="Detailed transaction metadata, status, confirmations, and audit notes will appear here."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_0.75fr]">
        <Panel title="TXN-90841">
          <div className="mb-5 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <div className="flex gap-3">
              <CheckCircle2 className="h-5 w-5" />
              <div>
                <p className="font-semibold">Deposit credited</p>
                <p className="mt-1 text-sm">BTC deposit completed after 3 confirmations.</p>
              </div>
            </div>
          </div>
          <dl className="grid gap-4 text-sm md:grid-cols-2">
            <div><dt className="text-banking-muted">Type</dt><dd className="mt-1 font-semibold">crypto_deposit</dd></div>
            <div><dt className="text-banking-muted">Status</dt><dd className="mt-1"><StatusBadge status="credited" /></dd></div>
            <div><dt className="text-banking-muted">Asset</dt><dd className="mt-1 font-semibold">BTC</dd></div>
            <div><dt className="text-banking-muted">Amount</dt><dd className="mt-1 font-semibold">+0.1200 BTC</dd></div>
            <div><dt className="text-banking-muted">Fiat value</dt><dd className="mt-1 font-semibold">$8,284.20</dd></div>
            <div><dt className="text-banking-muted">Confirmations</dt><dd className="mt-1 font-semibold">3 / 3</dd></div>
            <div className="md:col-span-2"><dt className="text-banking-muted">Wallet address</dt><dd className="mt-1 break-all font-semibold">bc1q9northunion7k2s0wallet4btc</dd></div>
            <div className="md:col-span-2"><dt className="text-banking-muted">Transaction hash</dt><dd className="mt-1 flex items-center gap-2 break-all font-semibold">8f29northunion0c4btcdeposit91aa <Copy className="h-4 w-4 text-banking-blue" /></dd></div>
          </dl>
        </Panel>
        <Panel title="Review timeline">
          <div className="space-y-4">
            {["Deposit detected", "Confirmations complete", "Risk checks passed", "Balance credited"].map((item) => (
              <div key={item} className="flex gap-3">
                <div className="mt-1 grid h-6 w-6 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="font-semibold">{item}</p>
                  <p className="text-sm text-banking-muted">May 12, 2026</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
