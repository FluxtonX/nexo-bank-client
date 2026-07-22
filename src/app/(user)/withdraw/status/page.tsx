import { PageTitle, Panel } from "@/components/dashboard/blocks";
import { StatusBadge } from "@/components/ui/status-badge";

export default function WithdrawalStatusPage() {
  return (
    <>
      <PageTitle title="Withdrawal Status" description="Track Interac withdrawal review, approval, processing, and completion." />
      <Panel title="Request WDR-2204">
        <div className="space-y-4">
          {["submitted", "pending_review", "security_check", "approved", "processing", "completed"].map((status, index) => (
            <div key={status} className="flex items-center justify-between rounded-md border border-banking-border p-4">
              <div>
                <p className="font-semibold capitalize">{status.replaceAll("_", " ")}</p>
                <p className="text-sm text-banking-muted">Step {index + 1} of withdrawal workflow</p>
              </div>
              <StatusBadge status={index < 2 ? status : "closed"} />
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}
