"use client";

import Link from "next/link";
import { Copy, ExternalLink, QrCode, ShieldAlert } from "lucide-react";
import { useToast } from "@/components/ui/toast";

type WalletCardProps = {
  symbol: string;
  name: string;
  balance: string;
  value: string;
  network: string;
  address: string;
};

export function WalletCard({
  symbol,
  name,
  balance,
  value,
  network,
  address,
}: WalletCardProps) {
  const { notify } = useToast();

  return (
    <article className="rounded-lg border border-banking-border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-banking-muted">{name}</p>
          <h2 className="mt-1 text-2xl font-semibold">{symbol}</h2>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-md bg-blue-50 text-banking-blue">
          <QrCode className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-md bg-banking-offWhite p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-banking-muted">
            Balance
          </p>
          <p className="mt-1 font-semibold">{balance}</p>
        </div>
        <div className="rounded-md bg-banking-offWhite p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-banking-muted">
            Value
          </p>
          <p className="mt-1 font-semibold">{value}</p>
        </div>
      </div>
      <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        <div className="flex gap-2">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          Use only {network} for this wallet.
        </div>
      </div>
      <p className="mt-4 break-all rounded-md border border-banking-border p-3 text-sm text-banking-muted">
        {address}
      </p>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() =>
            notify({
              title: "Wallet address copied",
              description: `${symbol} wallet address copied.`,
            })
          }
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-banking-border px-3 py-2 text-sm font-semibold"
        >
          <Copy className="h-4 w-4" />
          Copy
        </button>
        <Link
          href={`/wallets/${symbol.toLowerCase()}`}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-banking-blue px-3 py-2 text-sm font-semibold text-white"
        >
          <ExternalLink className="h-4 w-4" />
          Details
        </Link>
      </div>
    </article>
  );
}
