import { AuthCard } from "@/components/auth/auth-card";
import { OtpInput, PrimaryButton } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export default function PhoneOtpPage() {
  return (
    <AuthShell
      eyebrow="Phone verification"
      title="Protect withdrawals and sensitive account changes."
      description="Phone OTP adds another verification layer before high-risk account activity is enabled."
    >
      <AuthCard title="Verify phone" subtitle="Enter the code sent to your mobile number.">
        <form className="space-y-6">
          <OtpInput />
          <PrimaryButton>Verify phone number</PrimaryButton>
          <p className="text-center text-sm text-banking-muted">
            Need a new code? <button className="font-semibold text-banking-blue">Send again</button>
          </p>
        </form>
      </AuthCard>
    </AuthShell>
  );
}
