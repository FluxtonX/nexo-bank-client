import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { PageTitle, Panel } from "@/components/dashboard/blocks";

export default function AccountRestrictedPage() {
  return (
    <>
      <PageTitle
        title="Account Restricted"
        description="Your account can still be viewed, but deposits and withdrawals are temporarily unavailable."
      />
      <Panel title="Restriction notice">
        <div className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-amber-50 text-amber-600">
            <LockKeyhole className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-xl font-semibold">Action required</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-banking-muted">
            This screen supports frozen, restricted, suspended, or pending KYC account states with clear next steps.
          </p>
          <Link href="/support" className="mt-6 inline-flex rounded-md bg-banking-blue px-4 py-3 text-sm font-semibold text-white">
            Contact support
          </Link>
        </div>
      </Panel>
    </>
  );
}
