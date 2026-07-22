import { PageTitle } from "@/components/dashboard/blocks";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/states";

export default function StatesPage() {
  return (
    <>
      <PageTitle
        title="UI States"
        description="Reusable loading, empty, and error states for financial workflows and data-heavy pages."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <LoadingState label="Loading portfolio snapshot" />
        <EmptyState
          title="No withdrawals yet"
          description="Submitted Interac withdrawal requests will appear here."
        />
        <ErrorState
          title="Price feed unavailable"
          description="Portfolio values remain visible while live pricing reconnects."
        />
      </div>
    </>
  );
}
