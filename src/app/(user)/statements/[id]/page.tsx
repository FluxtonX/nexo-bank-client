import { Download, FileText, ShieldCheck } from "lucide-react";
import { PageTitle, Panel } from "@/components/dashboard/blocks";

export default function StatementDetailPage() {
  return (
    <>
      <PageTitle
        title="Monthly Statement"
        description="Static preview of a statement detail page with summary, exports, and compliance note."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_0.75fr]">
        <Panel title="May 2026 summary">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Opening balance", "$100,530.28"],
              ["Closing balance", "$105,740.46"],
              ["Net change", "+$5,210.18"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-md bg-banking-offWhite p-4">
                <p className="text-sm text-banking-muted">{label}</p>
                <p className="mt-2 text-2xl font-semibold">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-md border border-banking-border p-4">
            <div className="flex gap-3 text-sm text-banking-muted">
              <ShieldCheck className="h-5 w-5 text-banking-blue" />
              Statement values are for portfolio display and reporting UI only.
            </div>
          </div>
        </Panel>
        <Panel title="Exports">
          <div className="space-y-3">
            {["PDF statement", "CSV transactions", "Portfolio performance"].map((item) => (
              <button key={item} className="flex w-full items-center justify-between rounded-md border border-banking-border p-4 text-left">
                <span className="flex items-center gap-3 font-semibold">
                  <FileText className="h-5 w-5 text-banking-blue" />
                  {item}
                </span>
                <Download className="h-4 w-4 text-banking-muted" />
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
