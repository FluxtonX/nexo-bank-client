import { Mail, MessageSquare, Smartphone } from "lucide-react";
import { PageTitle, Panel } from "@/components/dashboard/blocks";

export default function NotificationPreferencesPage() {
  return (
    <>
      <PageTitle
        title="Notification Preferences"
        description="Choose how you receive KYC, deposit, withdrawal, security, and support updates."
      />
      <Panel title="Channels">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["In-app", "Always enabled for account safety.", MessageSquare],
            ["Email", "Security and transaction updates.", Mail],
            ["SMS", "Optional for OTP and urgent alerts.", Smartphone],
          ].map(([title, body, Icon]) => (
            <article key={title as string} className="rounded-md border border-banking-border p-4">
              <Icon className="h-5 w-5 text-banking-blue" />
              <div className="mt-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{title as string}</p>
                  <p className="mt-1 text-sm text-banking-muted">{body as string}</p>
                </div>
                <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-banking-border" />
              </div>
            </article>
          ))}
        </div>
      </Panel>
    </>
  );
}
