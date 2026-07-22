import { CheckCircle2 } from "lucide-react";
import { PageTitle, Panel } from "@/components/dashboard/blocks";

const groups = [
  {
    title: "Public Website",
    pages: ["Home", "About", "Pricing", "Security", "Help", "Contact", "Terms", "Privacy", "Risk Disclosure"],
  },
  {
    title: "Authentication",
    pages: ["Login", "Register", "Forgot Password", "Reset Password", "Email Verification", "Phone OTP", "2FA Setup", "2FA Verification", "Success", "Error"],
  },
  {
    title: "User Workspace",
    pages: ["Dashboard", "KYC Start", "KYC Pending", "KYC Approved", "KYC Rejected", "Wallets", "Wallet Detail", "Deposit", "Deposit Success", "Withdraw", "Withdrawal Status", "Withdrawal Detail", "Portfolio", "Transactions", "Transaction Detail", "Notifications", "Support", "Ticket Detail", "Statements", "Statement Detail", "Price Alerts", "Referral", "Settings"],
  },
  {
    title: "System States",
    pages: ["Maintenance", "404", "Account Restricted", "Loading", "Empty", "Error"],
  },
];

export default function UiCompletionPage() {
  return (
    <>
      <PageTitle
        title="UI Completion"
        description="Final checklist for the current user-facing static UI scope. Admin is intentionally excluded."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        {groups.map((group) => (
          <Panel key={group.title} title={group.title}>
            <div className="grid gap-3">
              {group.pages.map((page) => (
                <div key={page} className="flex items-center gap-3 rounded-md border border-banking-border p-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span className="font-medium">{page}</span>
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}
