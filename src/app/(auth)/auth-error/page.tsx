import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthShell } from "@/components/auth/auth-shell";

export default function AuthErrorPage() {
  return (
    <AuthShell
      eyebrow="Action needed"
      title="We could not complete this secure account step."
      description="Financial account flows need clear recovery paths when a link, code, or session is no longer valid."
    >
      <AuthCard
        title="Something went wrong"
        subtitle="The code may be expired, invalid, or already used."
      >
        <div className="space-y-6 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-amber-50 text-amber-600">
            <AlertTriangle className="h-9 w-9" />
          </div>
          <Link
            href="/login"
            className="inline-flex h-12 w-full items-center justify-center rounded-md bg-banking-blue px-4 text-sm font-semibold text-white shadow-glow transition hover:bg-banking-navy"
          >
            Return to login
          </Link>
        </div>
      </AuthCard>
    </AuthShell>
  );
}
