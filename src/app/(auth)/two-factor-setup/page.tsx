import Link from "next/link";
import { KeyRound, QrCode, ShieldCheck } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { OtpInput, PrimaryButton } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export default function TwoFactorSetupPage() {
  return (
    <AuthShell
      eyebrow="2FA setup"
      title="Add stronger protection before financial access."
      description="Set up two-factor authentication for withdrawals, password changes, new devices, and sensitive account updates."
    >
      <AuthCard
        title="Set up 2FA"
        subtitle="Scan the QR placeholder or enter the setup key, then confirm with a 6-digit code."
      >
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
            <div className="grid aspect-square place-items-center rounded-md border border-banking-border bg-banking-offWhite">
              <QrCode className="h-20 w-20 text-banking-blue" />
            </div>
            <div className="rounded-md bg-banking-offWhite p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-banking-text">
                <KeyRound className="h-4 w-4 text-banking-blue" />
                Manual setup key
              </div>
              <p className="mt-3 break-all text-sm text-banking-muted">
                NORTH-UNION-2FA-MOCK-KEY-4821
              </p>
            </div>
          </div>
          <OtpInput />
          <PrimaryButton>Enable 2FA</PrimaryButton>
          <Link href="/two-factor" className="flex items-center justify-center gap-2 text-sm font-semibold text-banking-blue">
            <ShieldCheck className="h-4 w-4" />
            Already enabled? Verify code
          </Link>
        </div>
      </AuthCard>
    </AuthShell>
  );
}
