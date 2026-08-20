"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    loadPendingWithdrawals();
  }, []);

  const loadPendingWithdrawals = async () => {
    try {
      const { data, error } = await supabase
        .from("withdrawal_requests")
        .select(`
          *,
          profiles!withdrawal_requests_user_id_fkey (
            full_name,
            email
          )
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setWithdrawals(data || []);
    } catch (error) {
      console.error("Failed to load withdrawals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (withdrawalId: string) => {
    setProcessing(withdrawalId);
    try {
      const res = await fetch("/api/admin/withdrawal/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ withdrawalId, adminId: "admin" }),
      });

      if (!res.ok) throw new Error("Failed to approve withdrawal");

      await loadPendingWithdrawals();
    } catch (error) {
      console.error("Approval error:", error);
      alert("Failed to approve withdrawal");
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (withdrawalId: string) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    setProcessing(withdrawalId);
    try {
      const res = await fetch("/api/admin/withdrawal/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ withdrawalId, adminId: "admin", reason }),
      });

      if (!res.ok) throw new Error("Failed to reject withdrawal");

      await loadPendingWithdrawals();
    } catch (error) {
      console.error("Rejection error:", error);
      alert("Failed to reject withdrawal");
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading pending withdrawals...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Withdrawal Approval</h1>
        
        {withdrawals.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center text-gray-500">
            No pending withdrawal requests
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {withdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{withdrawal.profiles?.full_name || "Unknown"}</div>
                        <div className="text-sm text-gray-500">{withdrawal.profiles?.email || "No email"}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      ${Number(withdrawal.amount).toLocaleString()} CAD
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {withdrawal.interac_email}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(withdrawal.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleApprove(withdrawal.id)}
                          disabled={processing === withdrawal.id}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
                        >
                          {processing === withdrawal.id ? "Processing..." : "Approve"}
                        </button>
                        <button
                          onClick={() => handleReject(withdrawal.id)}
                          disabled={processing === withdrawal.id}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 text-sm"
                        >
                          {processing === withdrawal.id ? "Processing..." : "Reject"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}