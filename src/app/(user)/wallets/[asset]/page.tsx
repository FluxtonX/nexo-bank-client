import Link from "next/link";
import { Copy, QrCode, ShieldAlert } from "lucide-react";
import { PageTitle, Panel } from "@/components/dashboard/blocks";

export default function WalletDetailPage() {
  return (
    <>
      <PageTitle
        title="Wallet Detail"
        description="Asset address, network rules, confirmations, balance summary, and deposit safety information."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <Panel title="BTC address">
          <div className="grid gap-5 md:grid-cols-[180px_1fr]">
            <div className="grid aspect-square place-items-center rounded-md border border-banking-border bg-banking-offWhite">
              <QrCode className="h-24 w-24 text-banking-blue" />
            </div>
            <div>
              <p className="text-sm text-banking-muted">Network</p>
              <p className="mt-1 font-semibold">Bitcoin</p>
              <p className="mt-4 break-all rounded-md border border-banking-border p-3 text-sm">
                bc1q9northunion7k2s0wallet4btc
              </p>
              <button className="mt-4 inline-flex items-center gap-2 rounded-md bg-banking-blue px-4 py-2 text-sm font-semibold text-white">
                <Copy className="h-4 w-4" />
                Copy address
              </button>
            </div>
          </div>
        </Panel>
        <Panel title="Deposit rules">
          <div className="space-y-3 text-sm text-banking-muted">
            <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-800">
              <div className="flex gap-2">
                <ShieldAlert className="h-5 w-5" />
                Send only BTC on the Bitcoin network.
              </div>
            </div>
            <p>Minimum deposit: 0.0005 BTC</p>
            <p>Expected confirmations: 3</p>
            <p>Deposit status: waiting_for_deposit</p>
            <Link href="/deposit" className="inline-flex rounded-md bg-banking-blue px-4 py-2 text-sm font-semibold text-white">
              Start deposit
            </Link>
          </div>
        </Panel>
      </div>
    </>
  );
}
