import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { label: "Start", href: "/kyc" },
  { label: "Personal", href: "/kyc/personal" },
  { label: "Address", href: "/kyc/address" },
  { label: "Documents", href: "/kyc/documents" },
  { label: "Selfie", href: "/kyc/selfie" },
  { label: "Status", href: "/kyc/status" },
];

export function KycStepper({ active }: { active: string }) {
  return (
    <div className="mb-6 overflow-x-auto">
      <div className="flex min-w-[720px] gap-2 rounded-lg border border-banking-border bg-white p-2">
        {steps.map((step) => {
          const isActive = step.label === active;
          return (
            <Link
              key={step.href}
              href={step.href}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-banking-muted",
                isActive && "bg-banking-blue text-white",
              )}
            >
              <CheckCircle2 className="h-4 w-4" />
              {step.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
