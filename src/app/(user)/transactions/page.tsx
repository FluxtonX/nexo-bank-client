"use client";

import { useState, useMemo } from "react";
import { Download, Search, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { TransactionTable } from "@/components/dashboard/blocks";
import { StatusBadge } from "@/components/ui/status-badge";
import { useClientTransactions, useDashboardMetrics, type TransactionRow } from "@/hooks/useClientQueries";

const FILTERS = ["All", "Deposits", "Withdrawals", "Fees", "Pending", "Rejected"];

export default function TransactionsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionRow | null>(null);
  const { data: transactions = [], isLoading } = useClientTransactions();
  const { data: metrics } = useDashboardMetrics();

  const filteredTransactions = useMemo(() => {
    return transactions.filter((row) => {
      let matchesType = true;
      if (activeFilter === "Deposits") matchesType = row.type === "deposit";
      if (activeFilter === "Withdrawals") matchesType = row.type === "withdrawal";
      if (activeFilter === "Fees") matchesType = row.type === "fee";
      if (activeFilter === "Pending") matchesType = row.status === "pending";
      if (activeFilter === "Rejected") matchesType = row.status === "rejected";

      const haystack = `${row.description} ${row.id} ${row.type} ${row.asset} ${row.status} ${row.amount}`.toLowerCase();
      const matchesSearch = haystack.includes(searchQuery.toLowerCase());

      return matchesType && matchesSearch;
    });
  }, [activeFilter, searchQuery, transactions]);

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) return;

    const headers = ["Date", "Description", "Type", "Asset", "Crypto Amount", "CAD Value", "Status"];
    const csvContent = [
      headers.join(","),
      ...filteredTransactions.map(row =>
        [row.date, row.description, row.type, row.asset, row.amount, row.fiat, row.status].map(val => `"${val}"`).join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "transactions-export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mx-auto w-full max-w-[1024px] mt-8 space-y-6">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-[#0A0F2C]">Transactions</h1>
          <p className="text-[14px] text-[#718096]">View and manage your transaction history</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-[12px] border border-gray-200 bg-white px-4 text-[14px] font-bold text-[#0A0F2C] shadow-sm hover:bg-gray-50 transition-colors"
        >
          <Download className="h-4 w-4" strokeWidth={2} />
          Export CSV
        </button>
      </div>

      <div className="rounded-[20px] border border-gray-100 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1 max-w-[480px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#718096]" strokeWidth={2} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by transaction ID, crypto, or hash..."
              className="h-[44px] w-full rounded-[14px] border border-gray-200 bg-white pl-11 pr-4 text-[14px] text-[#0A0F2C] placeholder-[#A0AEC0] outline-none transition-all focus:border-[#113285] focus:ring-1 focus:ring-[#113285]"
            />
          </div>

          <div className="flex flex-nowrap gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "h-[44px] shrink-0 rounded-[14px] px-5 text-[14px] font-bold transition-all whitespace-nowrap",
                    isActive
                      ? "bg-[#113285] text-white"
                      : "border border-gray-200 bg-white text-[#4A5568] hover:bg-gray-50"
                  )}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-[20px] border border-gray-100 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        {isLoading ? (
          <div className="flex py-12 justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#113285]" />
          </div>
        ) : filteredTransactions.length > 0 ? (
          <TransactionTable
            rows={filteredTransactions}
            onViewRow={(row) => {
              const full = transactions.find((tx) => tx.id === row.id);
              if (full) setSelectedTransaction(full);
            }}
          />
        ) : (
          <div className="py-12 text-center text-sm font-medium text-gray-500">
            No transactions found.
          </div>
        )}
      </div>

      {selectedTransaction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedTransaction(null)}
        >
          <div
            className="w-full max-w-md rounded-[20px] border border-gray-100 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-[#0A0F2C]">Transaction Details</h2>
              <button
                type="button"
                onClick={() => setSelectedTransaction(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-[#718096] hover:bg-gray-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-wide text-[#718096]">Type</p>
                <p className="mt-1 text-[14px] font-bold capitalize text-[#0A0F2C]">{selectedTransaction.type}</p>
              </div>
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-wide text-[#718096]">Amount</p>
                <p className="mt-1 text-[14px] font-bold text-[#0A0F2C]">
                  {selectedTransaction.asset !== "CAD" && selectedTransaction.asset !== "USD"
                    ? `${Number(selectedTransaction.amount).toFixed(6)} ${selectedTransaction.asset} ($${(Number(selectedTransaction.amount) * (metrics?.cadRates?.[selectedTransaction.asset] || 1)).toFixed(2)} CAD)`
                    : `${selectedTransaction.amount} ${selectedTransaction.asset}`}
                </p>
              </div>

              <div>
                <p className="text-[12px] font-semibold uppercase tracking-wide text-[#718096]">
                  Total Balance Before {selectedTransaction.type}
                </p>
                <p className="mt-1 text-[14px] font-bold text-[#0A0F2C]">
                  ${(
                    (metrics?.cadBalance || 0) + 
                    (selectedTransaction.type.toLowerCase() === "withdrawal" 
                      ? (selectedTransaction.status === "approved" || selectedTransaction.status === "completed" ? Number(selectedTransaction.amount) : 0)
                      : (selectedTransaction.status === "approved" || selectedTransaction.status === "completed" ? -Number(selectedTransaction.amount) : 0)
                    )
                  ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD
                </p>
              </div>
              
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-wide text-[#718096]">
                  {selectedTransaction.type.toLowerCase() === "withdrawal" ? "Remaining" : "New"} Available Balance
                </p>
                <p className="mt-1 text-[14px] font-bold text-[#0A0F2C]">
                  ${(
                    (metrics?.cadBalance || 0) + 
                    (selectedTransaction.type.toLowerCase() === "withdrawal"
                      ? (selectedTransaction.status === "pending" || selectedTransaction.status === "rejected" ? -Number(selectedTransaction.amount) : 0)
                      : (selectedTransaction.status === "pending" || selectedTransaction.status === "rejected" ? Number(selectedTransaction.amount) : 0)
                    )
                  ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD
                </p>
              </div>
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-wide text-[#718096]">Status</p>
                <div className="mt-1">
                  <StatusBadge status={selectedTransaction.status} />
                </div>
              </div>
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-wide text-[#718096]">Date</p>
                <p className="mt-1 text-[14px] font-bold text-[#0A0F2C]">
                  {selectedTransaction.rawDate.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-wide text-[#718096]">Transaction Hash</p>
                <p className="mt-1 break-all text-[14px] font-medium text-[#0A0F2C]">
                  {selectedTransaction.txHash || "N/A"}
                </p>
              </div>

              {selectedTransaction.status === "rejected" && (selectedTransaction.rejectionReason || selectedTransaction.adminNote) && (
                <div className="rounded-xl bg-red-50 p-4 border border-red-100 mt-6">
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-red-800 mb-1">Rejection Reason</p>
                  <p className="text-[14px] text-red-900 leading-relaxed">
                    {selectedTransaction.rejectionReason || selectedTransaction.adminNote}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
