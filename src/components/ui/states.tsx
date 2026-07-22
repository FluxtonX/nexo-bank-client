import { AlertTriangle, Inbox, Loader2 } from "lucide-react";

export function LoadingState({ label = "Loading secure data" }: { label?: string }) {
  return (
    <div className="grid min-h-48 place-items-center rounded-lg border border-banking-border bg-white p-8 text-center">
      <div>
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-banking-blue" />
        <p className="mt-3 text-sm font-medium text-banking-muted">{label}</p>
      </div>
    </div>
  );
}

export function EmptyState({
  title = "No records yet",
  description = "New activity will appear here once available.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="grid min-h-48 place-items-center rounded-lg border border-dashed border-banking-border bg-white p-8 text-center">
      <div>
        <Inbox className="mx-auto h-9 w-9 text-banking-blue" />
        <h2 className="mt-3 font-semibold text-banking-text">{title}</h2>
        <p className="mt-2 text-sm text-banking-muted">{description}</p>
      </div>
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "Please retry or contact support if the issue continues.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="grid min-h-48 place-items-center rounded-lg border border-rose-200 bg-rose-50 p-8 text-center">
      <div>
        <AlertTriangle className="mx-auto h-9 w-9 text-rose-600" />
        <h2 className="mt-3 font-semibold text-rose-800">{title}</h2>
        <p className="mt-2 text-sm text-rose-700">{description}</p>
      </div>
    </div>
  );
}
