"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { TransactionTable } from "@/components/dashboard/blocks";
import { transactions } from "@/data/mock";

const types = ["all", "crypto_deposit", "withdrawal_request", "admin_adjustment"];

export function TransactionExplorer() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");

  const filtered = useMemo(() => {
    return transactions.filter((row) => {
      const matchesType = type === "all" || row.type === type;
      const haystack = `${row.id} ${row.type} ${row.asset} ${row.status}`.toLowerCase();
      return matchesType && haystack.includes(query.toLowerCase());
    });
  }, [query, type]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1fr_220px]">
        <label className="flex h-11 items-center gap-2 rounded-md border border-banking-border px-3 text-sm text-banking-muted">
          <Search className="h-4 w-4" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-full flex-1 bg-transparent outline-none"
            placeholder="Search ID, asset, status"
          />
        </label>
        <select
          value={type}
          onChange={(event) => setType(event.target.value)}
          className="h-11 rounded-md border border-banking-border px-3 text-sm"
        >
          {types.map((item) => (
            <option key={item} value={item}>
              {item.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>
      <TransactionTable rows={filtered} />
    </div>
  );
}
