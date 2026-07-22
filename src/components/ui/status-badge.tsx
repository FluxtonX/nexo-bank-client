import { cn } from "@/lib/utils";

const tones: Record<string, string> = {
  credited: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  reviewed: "bg-blue-50 text-banking-blue ring-blue-200",
  pending_review: "bg-amber-50 text-amber-700 ring-amber-200",
  waiting_admin: "bg-amber-50 text-amber-700 ring-amber-200",
  resolved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  closed: "bg-slate-100 text-slate-600 ring-slate-200",
  frozen: "bg-rose-50 text-rose-700 ring-rose-200",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1",
        tones[status] ?? "bg-slate-100 text-slate-600 ring-slate-200",
      )}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}
