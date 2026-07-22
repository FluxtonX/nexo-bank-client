import { PageTitle, Panel } from "@/components/dashboard/blocks";
import { TicketExplorer } from "@/components/dashboard/ticket-explorer";

export default function TicketsPage() {
  return (
    <>
      <PageTitle
        title="Support Tickets"
        description="Track open, assigned, waiting, resolved, and closed support cases."
      />
      <Panel title="Ticket history">
        <TicketExplorer />
      </Panel>
    </>
  );
}
