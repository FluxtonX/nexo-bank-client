"use client";

import { Copy, Gift, ShieldAlert, UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { StatusBadge } from "@/components/ui/status-badge";

const referredUsers = [
  ["Maya Chen", "KYC submitted", "pending_review", "$50.00"],
  ["Omar Malik", "Active", "approved", "$50.00"],
  ["Sara Wilson", "Invited", "closed", "$0.00"],
];

export function ReferralProgram() {
  const { notify } = useToast();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <section className="rounded-lg border border-banking-border bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-banking-muted">Referral code</p>
              <p className="mt-1 text-3xl font-semibold text-banking-blue">
                NORTH-4821
              </p>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-md bg-blue-50 text-banking-blue">
              <UserPlus className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-5 flex gap-2">
            <input
              className="h-12 min-w-0 flex-1 rounded-md border border-banking-border px-4 text-sm"
              value="https://northunion.example/register?ref=NORTH-4821"
              readOnly
            />
            <button
              onClick={() =>
                notify({
                  title: "Referral link copied",
                  description: "Invite link is ready to share.",
                })
              }
              className="grid h-12 w-12 place-items-center rounded-md bg-banking-blue text-white"
            >
              <Copy className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <div className="flex gap-2">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              Referral rewards remain pending until fraud checks and operational
              review are complete.
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-banking-border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-md bg-amber-50 text-amber-600">
              <Gift className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-banking-muted">Pending rewards</p>
              <p className="text-3xl font-semibold">$150.00</p>
            </div>
          </div>
          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm text-banking-muted">
              <span>Monthly referral target</span>
              <span>3 / 5</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div className="h-2 w-[60%] rounded-full bg-banking-blue" />
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-md bg-banking-offWhite p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-banking-muted">
                Approved
              </p>
              <p className="mt-1 font-semibold">$50.00</p>
            </div>
            <div className="rounded-md bg-banking-offWhite p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-banking-muted">
                Review
              </p>
              <p className="mt-1 font-semibold">$100.00</p>
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-lg border border-banking-border bg-white p-5 shadow-sm">
        <h2 className="font-semibold">Referred users</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-banking-border text-xs uppercase tracking-[0.12em] text-banking-muted">
              <tr>
                <th className="py-3">Name</th>
                <th className="py-3">Milestone</th>
                <th className="py-3">Status</th>
                <th className="py-3">Reward</th>
              </tr>
            </thead>
            <tbody>
              {referredUsers.map(([name, milestone, status, reward]) => (
                <tr key={name} className="border-b border-banking-border last:border-0">
                  <td className="py-4 font-semibold">{name}</td>
                  <td className="py-4 text-banking-muted">{milestone}</td>
                  <td className="py-4">
                    <StatusBadge status={status} />
                  </td>
                  <td className="py-4 font-semibold">{reward}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
