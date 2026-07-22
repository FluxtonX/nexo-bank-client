import Link from "next/link";
import { AlertTriangle, CheckCircle2, Clock3, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const variants: Record<
  "approved" | "pending" | "rejected",
  {
    icon: LucideIcon;
    wrap: string;
    iconClass: string;
  }
> = {
  approved: {
    icon: CheckCircle2,
    wrap: "border-emerald-200 bg-emerald-50",
    iconClass: "text-emerald-600 bg-white",
  },
  pending: {
    icon: Clock3,
    wrap: "border-amber-200 bg-amber-50",
    iconClass: "text-amber-600 bg-white",
  },
  rejected: {
    icon: AlertTriangle,
    wrap: "border-rose-200 bg-rose-50",
    iconClass: "text-rose-600 bg-white",
  },
};

export function DecisionState({
  type,
  title,
  description,
  primaryHref,
  primaryLabel,
}: {
  type: "approved" | "pending" | "rejected";
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
}) {
  const variant = variants[type];
  const Icon = variant.icon;

  return (
    <section className={cn("rounded-lg border p-8 text-center shadow-sm", variant.wrap)}>
      <div className={cn("mx-auto grid h-16 w-16 place-items-center rounded-full", variant.iconClass)}>
        <Icon className="h-9 w-9" />
      </div>
      <h2 className="mt-5 text-2xl font-semibold tracking-normal text-banking-text">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-banking-muted">
        {description}
      </p>
      <Link
        href={primaryHref}
        className="mt-6 inline-flex rounded-md bg-banking-blue px-4 py-3 text-sm font-semibold text-white"
      >
        {primaryLabel}
      </Link>
    </section>
  );
}
