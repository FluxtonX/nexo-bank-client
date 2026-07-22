import { PageTitle, Panel } from "@/components/dashboard/blocks";
import { StatusBadge } from "@/components/ui/status-badge";

export default function WithdrawalDetailPage() {
  return (
    <>
      <PageTitle
        title="Withdrawal Detail"
        description="Interac request amount, recipient details, review stage, and operational notes."
      />
      <Panel title="WDR-2204">
        <dl className="grid gap-5 text-sm md:grid-cols-2">
          <div>
            <dt className="text-banking-muted">Amount</dt>
            <dd className="mt-1 text-xl font-semibold">$2,500.00 CAD</dd>
          </div>
          <div>
            <dt className="text-banking-muted">Status</dt>
            <dd className="mt-1"><StatusBadge status="pending_review" /></dd>
          </div>
          <div>
            <dt className="text-banking-muted">Interac email</dt>
            <dd className="mt-1 font-semibold">name@example.com</dd>
          </div>
          <div>
            <dt className="text-banking-muted">Submitted</dt>
            <dd className="mt-1 font-semibold">May 11, 2026</dd>
          </div>
        </dl>
      </Panel>
    </>
  );
}
