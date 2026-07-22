"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";

export function PageTitle({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal text-banking-text">
          {title}
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-banking-muted">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "neutral",
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: string;
}) {
  return (
    <article className="rounded-xl border border-banking-border bg-white p-5 shadow-[2px_2px_0px_0px_rgba(8,23,54,0.1)] border-b-2 border-r-2 border-banking-gold/30 transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(8,23,54,0.1)]">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-[10px] font-bold uppercase tracking-widest text-banking-muted">{label}</p>
          <p className="mt-1 text-xl font-black tracking-tight text-banking-ink truncate">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-banking-border bg-banking-offWhite shadow-inner",
            tone === "positive" && "text-emerald-600 bg-emerald-50/50 border-emerald-100",
            tone === "warning" && "text-amber-600 bg-amber-50/50 border-amber-100",
            tone === "neutral" && "text-banking-blue bg-blue-50/50 border-blue-100",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-banking-border/50 flex items-center justify-between">
        <p className="text-[10px] font-bold text-banking-muted truncate">
          {detail}
        </p>
        <span className="h-1.5 w-1.5 rounded-full bg-banking-gold shadow-glow-gold shrink-0" />
      </div>
    </article>
  );
}


export function Panel({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border-2 border-banking-border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="text-lg font-black tracking-tight text-banking-ink">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function PerformanceChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data = [
    { day: "Mon", value: 50000, label: "$50,000" },
    { day: "Tue", value: 15000, label: "$15,000" },
    { day: "Wed", value: 50000, label: "$50,000" },
    { day: "Thu", value: 30000, label: "$30,000" },
    { day: "Fri", value: 52000, label: "$52,000" },
    { day: "Sat", value: 5000,  label: "$5,000"  },
    { day: "Sun", value: 52000, label: "$52,000" },
  ];

  // SVG dimensions
  const viewBoxWidth = 800;
  const viewBoxHeight = 280;
  const paddingLeft = 60;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartWidth = viewBoxWidth - paddingLeft - paddingRight;
  const chartHeight = viewBoxHeight - paddingTop - paddingBottom;
  const maxVal = 60000;

  // Compute point coordinates
  const points = data.map((d, index) => {
    const x = paddingLeft + (index / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight * (1 - d.value / maxVal);
    return { x, y, ...d };
  });

  // Generate cubic bezier curve path d-attribute
  let linePath = "";
  let areaPath = "";

  if (points.length > 0) {
    linePath = `M ${points[0].x},${points[0].y}`;
    const dx = (chartWidth / (data.length - 1)) * 0.35;

    for (let i = 0; i < points.length - 1; i++) {
      const pStart = points[i];
      const pEnd = points[i + 1];
      linePath += ` C ${pStart.x + dx},${pStart.y} ${pEnd.x - dx},${pEnd.y} ${pEnd.x},${pEnd.y}`;
    }

    // Close the area path for fill gradient
    areaPath = `${linePath} L ${points[points.length - 1].x},${paddingTop + chartHeight} L ${points[0].x},${paddingTop + chartHeight} Z`;
  }

  // Y-axis grid line values
  const yTicks = [60000, 45000, 30000, 15000, 0];

  return (
    <div className="relative w-full overflow-hidden bg-white">
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className="w-full h-auto overflow-visible select-none"
      >
        <defs>
          {/* Area Gradient */}
          <linearGradient id="chartLineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#014EA1" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#014EA1" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal Gridlines */}
        {yTicks.map((tick, i) => {
          const y = paddingTop + chartHeight * (1 - tick / maxVal);
          return (
            <g key={tick} className="opacity-75">
              <line
                x1={paddingLeft}
                y1={y}
                x2={viewBoxWidth - paddingRight}
                y2={y}
                stroke="#E2E8F0"
                strokeWidth={i === yTicks.length - 1 ? 1.5 : 1}
                strokeDasharray={i === yTicks.length - 1 ? "0" : "5 5"}
              />
              {/* Y Axis Labels */}
              <text
                x={paddingLeft - 12}
                y={y + 4}
                textAnchor="end"
                className="text-[10px] font-bold fill-banking-muted font-sans"
              >
                {tick === 0 ? "0" : tick}
              </text>
            </g>
          );
        })}

        {/* Vertical Ticks (small lines) on the bottom axis */}
        {points.map((pt) => (
          <line
            key={pt.day}
            x1={pt.x}
            y1={paddingTop + chartHeight}
            x2={pt.x}
            y2={paddingTop + chartHeight + 4}
            stroke="#E2E8F0"
            strokeWidth={1}
          />
        ))}

        {/* Area Under Curve */}
        {areaPath && (
          <path
            d={areaPath}
            fill="url(#chartLineGradient)"
            className="transition-all duration-300"
          />
        )}

        {/* Spline Path */}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke="#014EA1"
            strokeWidth={2.5}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        )}

        {/* Data Circles / Interactive Hotspots */}
        {points.map((pt, index) => {
          const isHovered = hoveredIndex === index;
          return (
            <g
              key={pt.day}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer"
            >
              {/* Invisible large outer circle for easier hovering */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={16}
                fill="transparent"
              />
              
              {/* Glowing halo when hovered */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? 8 : 4}
                fill={isHovered ? "#3878B8" : "transparent"}
                fillOpacity={0.3}
                className="transition-all duration-200 ease-out"
              />

              {/* White outer stroke circle */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? 5.5 : 4}
                fill="#FFFFFF"
                stroke="#014EA1"
                strokeWidth={isHovered ? 2.5 : 2}
                className="transition-all duration-200 ease-out shadow-sm"
              />
              
              {/* X Axis Labels */}
              <text
                x={pt.x}
                y={paddingTop + chartHeight + 20}
                textAnchor="middle"
                className={cn(
                  "text-[11px] font-bold transition-colors font-sans",
                  isHovered ? "fill-banking-blue" : "fill-banking-muted"
                )}
              >
                {pt.day}
              </text>
            </g>
          );
        })}
      </svg>

      {/* HTML Floating Tooltip */}
      {hoveredIndex !== null && (
        <div
          className="absolute z-30 pointer-events-none rounded-lg bg-banking-ink px-3 py-1.5 text-[11px] font-bold text-white shadow-xl flex flex-col gap-0.5 -translate-x-1/2 -translate-y-full transition-all duration-150"
          style={{
            left: `${(points[hoveredIndex].x / viewBoxWidth) * 100}%`,
            top: `${(points[hoveredIndex].y / viewBoxHeight) * 100 - 4}%`,
          }}
        >
          <span className="opacity-70 text-[9px] uppercase tracking-wider">{points[hoveredIndex].day} Portfolio Value</span>
          <span className="text-banking-gold text-xs font-black">{points[hoveredIndex].label} CAD</span>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-banking-ink" />
        </div>
      )}
    </div>
  );
}


export function AssetRow({
  symbol,
  name,
  balance,
  value,
  allocation,
  change,
}: {
  symbol: string;
  name: string;
  balance: string;
  value: string;
  allocation: number;
  change: string;
}) {
  return (
    <div className="grid gap-3 border-b border-banking-border py-4 last:border-0 md:grid-cols-[1.2fr_1fr_1fr_0.8fr] md:items-center hover:bg-banking-offWhite px-2 rounded-lg transition-colors">
      <div>
        <p className="font-black text-banking-ink">{symbol}</p>
        <p className="text-[10px] font-bold uppercase text-banking-muted">{name}</p>
      </div>
      <div className="text-sm font-semibold text-banking-muted">{balance}</div>
      <div className="font-black text-banking-blue">{value}</div>
      <div>
        <div className="mb-1.5 flex justify-between text-[10px] font-black text-banking-muted uppercase">
          <span>{change}</span>
          <span>{allocation}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden border border-banking-border">
          <div
            className="h-full rounded-full bg-banking-gold"
            style={{ width: `${allocation}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function AccountHealth() {
  return (
    <article className="rounded-xl border border-banking-border bg-white p-5 shadow-[2px_2px_0px_0px_rgba(8,23,54,0.1)] border-b-2 border-r-2 border-banking-gold/30 transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(8,23,54,0.1)]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] font-bold text-banking-ink uppercase tracking-widest">Account Health</h3>
        <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 uppercase">Pending Verification</span>
      </div>
      <div className="flex items-end gap-1 mb-4 h-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className={cn("flex-1 rounded-sm transition-all", i <= 4 ? "bg-banking-gold h-2.5" : "bg-slate-100 h-1.5")} />
        ))}
      </div>
      <div className="pt-3 border-t border-banking-border/50">
        <p className="text-[10px] font-bold text-banking-muted leading-tight">
          Verify identity to unlock full limits. <Link href="/kyc" className="text-banking-blue hover:underline">Verify Now</Link>
        </p>
      </div>
    </article>
  );
}




export function TransactionTable({
  rows,
  onViewRow,
}: {
  rows: Array<{
    id: string;
    type: string;
    asset: string;
    amount: string;
    fiat: string;
    status: string;
    date: string;
    description?: string;
  }>;
  onViewRow?: (row: {
    id: string;
    type: string;
    asset: string;
    amount: string;
    fiat: string;
    status: string;
    date: string;
    description?: string;
  }) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead className="border-b border-banking-border text-xs uppercase tracking-[0.12em] text-banking-muted">
          <tr>
            <th className="py-3 font-semibold">Date</th>
            <th className="py-3 font-semibold">Description</th>
            <th className="py-3 font-semibold">Type</th>
            <th className="py-3 font-semibold">Asset</th>
            <th className="py-3 font-semibold">Crypto Amount</th>
            <th className="py-3 font-semibold">CAD Value</th>
            <th className="py-3 font-semibold">Status</th>
            {onViewRow && <th className="py-3 font-semibold">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-banking-border last:border-0 hover:bg-banking-offWhite transition-colors">
              <td className="py-4 text-banking-muted">{row.date}</td>
              <td className="py-4 font-semibold text-banking-text">
                <div className="flex flex-col">
                  <span>{row.description || row.id}</span>
                  <span className="text-[10px] font-medium text-banking-muted uppercase">{row.id}</span>
                </div>
              </td>
              <td className="py-4 text-xs font-medium uppercase text-banking-muted">{row.type.replaceAll("_", " ")}</td>
              <td className="py-4">{row.asset}</td>
              <td className="py-4 font-bold text-banking-text uppercase tracking-wider">{row.amount}</td>
              <td className="py-4 font-bold text-banking-text">{row.fiat}</td>
              <td className="py-4"><StatusBadge status={row.status} /></td>
              {onViewRow && (
                <td className="py-4">
                  <button
                    type="button"
                    onClick={() => onViewRow(row)}
                    className="text-sm font-semibold text-banking-blue hover:underline"
                  >
                    View
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

