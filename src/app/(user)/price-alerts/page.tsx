import { PageTitle, Panel } from "@/components/dashboard/blocks";
import { PriceAlertForm } from "@/components/forms/price-alert-form";

export default function PriceAlertsPage() {
  return (
    <>
      <PageTitle
        title="Price Alerts"
        description="Create BTC, ETH, and USDT alerts for price above, price below, or percentage movement."
      />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel title="Create alert">
          <PriceAlertForm />
        </Panel>
        <Panel title="Active alerts">
          <div className="space-y-3">
            {["BTC above $75,000", "ETH below $3,100", "BTC percentage change 5%"].map((alert) => (
              <div key={alert} className="flex items-center justify-between rounded-md border border-banking-border p-4">
                <p className="font-medium">{alert}</p>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Enabled</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
