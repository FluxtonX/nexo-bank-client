"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { AlertTriangle, ClipboardCheck, Copy, QrCode } from "lucide-react";
import { CoinLogo } from "@/components/market/CoinLogo";
import type { DepositAddressConfig } from "@/config/depositAddresses";

interface FixedDepositQRProps {
  config?: DepositAddressConfig | null;
  /** When provided, overrides config.address / config.qrValue with a live DB address */
  liveAddress?: string | null;
  /** When true, shows an error that the address is unavailable */
  addressError?: boolean;
}

export function FixedDepositQR({ config, liveAddress, addressError }: FixedDepositQRProps) {
  const [copied, setCopied] = useState(false);

  if (!config) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-[#F8FAFC] p-6 text-sm font-semibold text-[#718096]">
        Select an asset and network to generate a deposit QR code.
      </div>
    );
  }

  // Use live DB address if available, otherwise fall back to config address
  const displayAddress = liveAddress ?? config.address;

  if (addressError || !displayAddress) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <p className="text-sm font-semibold text-red-800">
            Deposit address temporarily unavailable. Please contact support.
          </p>
        </div>
      </div>
    );
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(displayAddress);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-[#0A0F2C] p-5 text-white shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <CoinLogo
            src={config.logoUrl}
            symbol={config.asset}
            className="h-11 w-11 border-white/20 bg-white p-1.5"
          />
          <div className="min-w-0">
            <p className="text-base font-bold">Deposit {config.assetName}</p>
            <p className="truncate text-xs font-semibold text-white/60">{config.networkName}</p>
          </div>
        </div>
        <QrCode className="h-5 w-5 shrink-0 text-white/60" />
      </div>

      <div className="flex justify-center rounded-2xl bg-white p-5">
        <QRCodeSVG
          value={displayAddress}
          size={220}
          level="H"
          includeMargin
          className="h-auto max-w-full"
        />
      </div>

      <button
        onClick={handleCopy}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-[#0A0F2C] transition-colors hover:bg-blue-50"
      >
        {copied ? <ClipboardCheck className="h-4 w-4 shrink-0 text-emerald-600" /> : <Copy className="h-4 w-4 shrink-0" />}
        <span className="truncate">{displayAddress}</span>
      </button>

      <div className="mt-4 rounded-2xl border border-amber-300/25 bg-amber-300/10 p-4">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
          <p className="text-xs font-semibold leading-5 text-amber-50">{config.warning}</p>
        </div>
      </div>
    </div>
  );
}
