import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthShell } from "@/components/auth/auth-shell";

export default function AuthSuccessPage() {
  return (
    <AuthShell
      eyebrow="Verification complete"
      title="Your secure onboarding step is complete."
      description="Continue to the next protected workflow with clear account status and guided verification."
    >
      <AuthCard
        title="Success"
        subtitle="This account step has been completed successfully."
      >
        <div className="space-y-6 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <Link
            href="/login"
            className="inline-flex h-12 w-full items-center justify-center rounded-md bg-banking-blue px-4 text-sm font-semibold text-white shadow-glow transition hover:bg-banking-navy"
          >
            Continue
          </Link>
        </div>
      </AuthCard>
    </AuthShell>
  );
}
