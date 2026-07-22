"use client";

import Link from "next/link";
import { Download, FileText } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export function ReportCard({
  title,
  description,
  format,
}: {
  title: string;
  description: string;
  format: string;
}) {
  const { notify } = useToast();

  return (
    <article className="rounded-lg border border-banking-border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="grid h-11 w-11 place-items-center rounded-md bg-blue-50 text-banking-blue">
          <FileText className="h-5 w-5" />
        </div>
        <span className="rounded-full bg-banking-offWhite px-2.5 py-1 text-xs font-semibold text-banking-muted">
          {format}
        </span>
      </div>
      <h2 className="mt-5 font-semibold">{title}</h2>
      <p className="mt-2 min-h-12 text-sm leading-6 text-banking-muted">
        {description}
      </p>
      <button
        onClick={() =>
          notify({
            title: "Report queued",
            description: `${title} would download as ${format}.`,
          })
        }
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-banking-blue px-4 py-2.5 text-sm font-semibold text-white"
      >
        <Download className="h-4 w-4" />
        Download
      </button>
      <Link
        href="/statements/may-2026"
        className="mt-2 inline-flex w-full items-center justify-center rounded-md border border-banking-border px-4 py-2.5 text-sm font-semibold"
      >
        View detail
      </Link>
    </article>
  );
}
