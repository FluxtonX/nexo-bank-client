import { PageTitle } from "@/components/dashboard/blocks";
import { ReferralProgram } from "@/components/dashboard/referral-program";

export default function ReferralPage() {
  return (
    <>
      <PageTitle
        title="Referral"
        description="Invite users, copy referral links, and track rewards when the referral program is enabled."
      />
      <ReferralProgram />
    </>
  );
}
