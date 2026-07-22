import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { PageTitle, Panel } from "@/components/dashboard/blocks";

export default function DepositSuccessPage() {
  return (
    <>
      <PageTitle title="Deposit Detected" description="Your crypto deposit has been detected and is waiting for required confirmations." />
      <Panel title="Deposit status">
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-600" />
          <h2 className="mt-4 text-xl font-semibold">BTC deposit detected</h2>
          <p className="mt-2 text-sm text-banking-muted">Status: pending confirmations. You will be notified when credited.</p>
          <Link href="/transactions" className="mt-6 inline-flex rounded-md bg-banking-blue px-4 py-3 text-sm font-semibold text-white">
            View transactions
          </Link>
        </div>
      </Panel>
    </>
  );
}
