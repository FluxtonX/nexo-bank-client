import { PageTitle, Panel } from "@/components/dashboard/blocks";
import { NotificationCenter } from "@/components/dashboard/notification-center";

export default function NotificationsPage() {
  return (
    <>
      <PageTitle
        title="Notifications"
        description="Account, KYC, deposit, withdrawal, support, and security updates in one place."
      />
      <Panel title="Recent notifications">
        <NotificationCenter />
      </Panel>
    </>
  );
}
