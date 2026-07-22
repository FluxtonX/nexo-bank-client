"use client";

import React, { useState } from "react";
import { ArrowUpRight, PieChart, TrendingUp } from "lucide-react";
import { portfolioAssets } from "@/data/mock";
import { cn } from "@/lib/utils";

export function AllocationDonut() {
  const [activeAsset, setActiveAsset] = useState<string | null>(null);

  // Asset colors for highlighting
  const assetColors: Record<string, { stroke: string; bg: string }> = {
    BTC: { stroke: "#F5A623", bg: "bg-[#F5A623]" },
    ETH: { stroke: "#3B82F6", bg: "bg-[#3B82F6]" },
    USDT: { stroke: "#10B981", bg: "bg-[#10B981]" },
    BNB: { stroke: "#F0B90B", bg: "bg-[#F0B90B]" },
    SOL: { stroke: "#14F195", bg: "bg-[#14F195]" },
    XRP: { stroke: "#64748B", bg: "bg-[#64748B]" },
    ADA: { stroke: "#4F46E5", bg: "bg-[#4F46E5]" },
    DOGE: { stroke: "#EC4899", bg: "bg-[#EC4899]" },
  };

  // Donut values
  const radius = 45;
  const circumference = 2 * Math.PI * radius; // ~282.74

  let accumulatedPercent = 0;
  const donutSegments = portfolioAssets.map((asset) => {
    const strokeLength = circumference * (asset.allocation / 100);
    const strokeOffset = -circumference * (accumulatedPercent / 100);
    accumulatedPercent += asset.allocation;
    const colors = assetColors[asset.symbol] || { stroke: "#94A3B8", bg: "bg-[#94A3B8]" };
    return {
      symbol: asset.symbol,
      strokeDasharray: `${strokeLength} ${circumference}`,
      strokeDashoffset: strokeOffset,
      stroke: colors.stroke,
    };
  });

  const activeAssetData = activeAsset 
    ? portfolioAssets.find(a => a.symbol === activeAsset) 
    : null;

  return (
    <div className="grid gap-8 md:grid-cols-[220px_1fr] md:items-center">
      {/* Left: SVG Donut Chart */}
      <div className="relative mx-auto w-48 h-48 select-none">
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full transform -rotate-90 overflow-visible"
        >
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke="#F1F5F9"
            strokeWidth="10"
          />
          {donutSegments.map((segment) => {
            const isActive = activeAsset === segment.symbol;
            return (
              <circle
                key={segment.symbol}
                cx="60"
                cy="60"
                r={radius}
                fill="transparent"
                stroke={segment.stroke}
                strokeWidth={isActive ? 14 : 10}
                strokeDasharray={segment.strokeDasharray}
                strokeDashoffset={segment.strokeDashoffset}
                strokeLinecap="butt"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setActiveAsset(segment.symbol)}
                onMouseLeave={() => setActiveAsset(null)}
                onClick={() => setActiveAsset(activeAsset === segment.symbol ? null : segment.symbol)}
              />
            );
          })}
        </svg>
        {/* Center Text inside Donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 pointer-events-none">
          {activeAssetData ? (
            <>
              <span 
                className="text-sm font-black uppercase tracking-wider leading-none"
                style={{ color: assetColors[activeAssetData.symbol]?.stroke || "#000" }}
              >
                {activeAssetData.symbol}
              </span>
              <span className="text-xs font-black text-banking-muted mt-1.5 leading-none">
                {activeAssetData.allocation}%
              </span>
              <span className="text-[10px] font-extrabold text-banking-ink mt-1.5 leading-none truncate max-w-[90px]">
                {activeAssetData.value.split(".")[0]}
              </span>
            </>
          ) : (
            <>
              <span className="text-[10px] font-black tracking-widest text-banking-muted uppercase leading-none">
                Allocation
              </span>
              <span className="text-xl font-extrabold text-banking-ink mt-1.5 leading-none">
                {portfolioAssets.length} Assets
              </span>
            </>
          )}
        </div>
      </div>

      {/* Right: Asset List Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        {portfolioAssets.map((asset) => {
          const colors = assetColors[asset.symbol] || { stroke: "#94A3B8", bg: "bg-[#94A3B8]" };
          const isActive = activeAsset === asset.symbol;
          return (
            <div
              key={asset.symbol}
              onMouseEnter={() => setActiveAsset(asset.symbol)}
              onMouseLeave={() => setActiveAsset(null)}
              onClick={() => setActiveAsset(activeAsset === asset.symbol ? null : asset.symbol)}
              className={cn(
                "flex items-center justify-between gap-4 rounded-xl border border-banking-border p-3.5 transition-all cursor-pointer select-none border-b-2 border-r-2",
                isActive 
                  ? "bg-white shadow-md border-b-4 border-r-4 -translate-y-0.5 scale-[1.01]" 
                  : "hover:bg-banking-offWhite/50 hover:border-banking-blue/20"
              )}
              style={{
                borderColor: isActive ? colors.stroke : undefined,
              }}
            >
              <div className="flex items-center gap-3">
                <span className={cn("h-3 w-3 rounded-full shrink-0", colors.bg)} />
                <div>
                  <p className="font-extrabold text-sm text-banking-ink">{asset.symbol}</p>
                  <p className="text-xs text-banking-muted mt-0.5">{asset.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-extrabold text-sm text-banking-ink">{asset.allocation}%</p>
                <p className="text-[10px] font-bold text-banking-muted mt-0.5">{asset.value.split(".")[0]}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PortfolioInsightStrip() {
  return (
    <div className="mb-6 grid gap-4 md:grid-cols-3">
      {[
        ["Net deposits", "$96,400.28", "+$9,340.18 unrealized", TrendingUp],
        ["Best performer", "BTC", "+4.8% today", ArrowUpRight],
        ["Risk profile", "Balanced", "52% BTC allocation", PieChart],
      ].map(([label, value, detail, Icon]) => (
        <article key={label as string} className="rounded-lg border border-banking-border bg-white p-5 shadow-sm">
          <Icon className="h-5 w-5 text-banking-blue" />
          <p className="mt-4 text-sm font-medium text-banking-muted">{label as string}</p>
          <p className="mt-1 text-2xl font-semibold">{value as string}</p>
          <p className="mt-2 text-sm text-banking-muted">{detail as string}</p>
        </article>
      ))}
    </div>
  );
}
