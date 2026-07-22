"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Eye,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Info,
  X,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Sector,
} from "recharts";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";
import {
  useDashboardMetrics,
  useRecentTransactions,
  useClientTransactions,
  type TransactionRow,
  type ClientTransaction,
} from "@/hooks/useClientQueries";
import { CoinLogo } from "@/components/market/CoinLogo";
import { getCoinBySymbol } from "@/config/coins";
import { cn, COIN_COLORS } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

type PerformanceTimeRange = "1D" | "1W" | "1M" | "3M" | "6M" | "YTD" | "1Y" | "MAX" | "Custom";

const PERFORMANCE_TIME_RANGES: PerformanceTimeRange[] = [
  "1D",
  "1W",
  "1M",
  "3M",
  "6M",
  "YTD",
  "1Y",
  "MAX",
  "Custom",
];

const ASSET_GRADIENTS: Record<
  string,
  { id: string; light: string; dark: string; dot: string; label: string }
> = {
  BTC: { id: "gradBtc", light: "#2563EB", dark: "#1D4ED8", dot: "#2563EB", label: "Bitcoin" },
  ETH: { id: "gradEth", light: "#6366f1", dark: "#4f46e5", dot: "#6366f1", label: "Ethereum" },
  USDT: { id: "gradUsdt", light: "#F59E0B", dark: "#D97706", dot: "#F59E0B", label: "USDT" },
  USDC: { id: "gradUsdc", light: "#3b82f6", dark: "#2563eb", dot: "#3b82f6", label: "USDC" },
  CAD: { id: "gradCad", light: "#10b981", dark: "#059669", dot: "#10b981", label: "CAD" },
};

// Dynamic gradient builder for any currency
function buildAssetGradient(symbol: string) {
  const color = COIN_COLORS[symbol] || "#6b7280";
  return {
    id: `grad${symbol}`,
    light: color,
    dark: color,
    dot: color,
    label: symbol,
  };
}

function txToCad(
  tx: TransactionRow,
  cadRates: Record<string, number>,
): number {
  const sym = (tx.asset || "CAD").toUpperCase();
  let amount = tx.rawAmount;

  // Phase 1: Currency detection - if already CAD or USD, don't multiply by exchange rate
  if (sym === "CAD" || sym === "USD") {
    return amount;
  }

  // Phase 1: Unit detection and correction based on asset type
  if (sym === "BTC" && amount > 1_000_000_000) {
    // Likely in satoshis, convert to BTC
    amount = amount / 100_000_000;
  } else if (sym === "ETH" && amount > 1_000_000_000_000_000_000) {
    // Likely in wei, convert to ETH
    amount = amount / 1_000_000_000_000_000_000;
  } else if (sym === "USDT" && amount > 10_000 && amount < 1_000_000_000) {
    // Could be in cents, convert to USDT
    amount = amount / 100;
  }

  // Phase 1: Transaction amount validation - check for unreasonably large values
  const rate = cadRates[sym] || cadRates.USDT || 1.36;
  const cadValue = amount * rate;
  
  if (cadValue > 1_000_000_000) {
    return 0;
  }

  return cadValue;
}

function getRangeBounds(
  range: PerformanceTimeRange,
  customStart: Date | null,
  customEnd: Date | null,
  allTxs: TransactionRow[],
): { start: Date; end: Date } {
  const end = customEnd ? new Date(customEnd) : new Date();
  end.setHours(23, 59, 59, 999);

  if (range === "Custom" && customStart) {
    const start = new Date(customStart);
    start.setHours(0, 0, 0, 0);
    return { start, end: customEnd ? end : new Date() };
  }

  const start = new Date(end);
  switch (range) {
    case "1D":
      start.setDate(start.getDate() - 1);
      break;
    case "1W":
      start.setDate(start.getDate() - 7);
      break;
    case "1M":
      start.setMonth(start.getMonth() - 1);
      break;
    case "3M":
      start.setMonth(start.getMonth() - 3);
      break;
    case "6M":
      start.setMonth(start.getMonth() - 6);
      break;
    case "YTD":
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      break;
    case "1Y":
      start.setFullYear(start.getFullYear() - 1);
      break;
    case "MAX":
    default:
      if (allTxs.length > 0) {
        start.setTime(Math.min(...allTxs.map((t) => t.rawDate.getTime())));
      } else {
        start.setFullYear(start.getFullYear() - 5);
      }
      break;
  }
  start.setHours(0, 0, 0, 0);
  return { start, end };
}

function formatBucketLabel(date: Date, range: PerformanceTimeRange): string {
  if (range === "1D") {
    return date.toLocaleTimeString([], { hour: "numeric" });
  }
  if (range === "1W" || range === "1M") {
    return date.toLocaleDateString([], { weekday: "short" });
  }
  if (range === "3M" || range === "6M" || range === "Custom") {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }
  return date.toLocaleDateString([], { month: "short" });
}

function buildPerformanceChartData(
  allTxs: TransactionRow[],
  range: PerformanceTimeRange,
  portfolioValue: number,
  cadRates: Record<string, number>,
  customStart: Date | null,
  customEnd: Date | null,
): { name: string; value: number }[] {
  try {
    const { start, end } = getRangeBounds(range, customStart, customEnd, allTxs);
    const val = portfolioValue || 0;
    const pointCount = 7;
    const duration = Math.max(end.getTime() - start.getTime(), 1);
    const step = duration / (pointCount - 1);

    const sortedTxs = [...allTxs].sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());
    
    // Phase 2: Transaction type validation - only process deposit/withdrawal, filter out pending/rejected
    const txsInRange = sortedTxs.filter((t) => {
      const inRange = t.rawDate >= start && t.rawDate <= end;
      const validType = t.type === "deposit" || t.type === "withdrawal";
      const validStatus = t.status !== "pending" && t.status !== "rejected";
      return inRange && validType && validStatus;
    });

    const netInPeriod = txsInRange.reduce((sum, tx) => {
      const cad = txToCad(tx, cadRates);
      return sum + (tx.type === "deposit" ? cad : -cad);
    }, 0);

    // Phase 2: Sanity check - netInPeriod shouldn't exceed portfolioValue by unreasonable margin
    // Relaxed threshold from 10x to 100x to allow for legitimate high-volume trading
    if (Math.abs(netInPeriod) > val * 100 && val > 0) {
      return Array.from({ length: pointCount }, (_, index) => {
        const bucketDate = new Date(start.getTime() + step * index);
        return { name: formatBucketLabel(bucketDate, range), value: val };
      });
    }

    const baseline = Math.max(0, val - netInPeriod);

    // Phase 2: Sanity check - baseline should not be negative (already handled by Math.max, but check anyway)
    if (baseline < 0) {
      return Array.from({ length: pointCount }, (_, index) => {
        const bucketDate = new Date(start.getTime() + step * index);
        return { name: formatBucketLabel(bucketDate, range), value: val };
      });
    }

    if (txsInRange.length === 0) {
      // No transactions in this period — show current portfolio value as a flat line.
      return Array.from({ length: pointCount }, (_, index) => {
        const bucketDate = new Date(start.getTime() + step * index);
        return { name: formatBucketLabel(bucketDate, range), value: val };
      });
    }

    let running = baseline;
    let txIndex = 0;

    const dataPoints = Array.from({ length: pointCount }, (_, index) => {
      const bucketEnd =
        index === pointCount - 1 ? end : new Date(start.getTime() + step * (index + 1));

      while (txIndex < txsInRange.length && txsInRange[txIndex].rawDate <= bucketEnd) {
        const tx = txsInRange[txIndex];
        const cad = txToCad(tx, cadRates);
        running += tx.type === "deposit" ? cad : -cad;
        txIndex += 1;
      }

      const bucketDate = new Date(start.getTime() + step * index);
      const value = index === pointCount - 1 ? val : Math.max(0, Math.round(running));

      // Phase 2: Final sanity check on individual data points - relaxed threshold
      if (value > val * 1000 && val > 0) {
        return {
          name: formatBucketLabel(bucketDate, range),
          value: val,
        };
      }

      return {
        name: formatBucketLabel(bucketDate, range),
        value,
      };
    });

    return dataPoints;
  } catch (error) {
    // Phase 2: Error handling - catch any calculation errors and fall back to flat line
    const { start, end } = getRangeBounds(range, customStart, customEnd, allTxs);
    const val = portfolioValue || 0;
    const pointCount = 7;
    const duration = Math.max(end.getTime() - start.getTime(), 1);
    const step = duration / (pointCount - 1);
    
    return Array.from({ length: pointCount }, (_, index) => {
      const bucketDate = new Date(start.getTime() + step * index);
      return { name: formatBucketLabel(bucketDate, range), value: val };
    });
  }
}

function AllocationActiveShape(props: PieSectorDataItem) {
  const {
    cx = 0,
    cy = 0,
    innerRadius = 0,
    outerRadius = 0,
    startAngle = 0,
    endAngle = 0,
    fill = "#888",
  } = props;

  return (
    <g transform={`translate(0, -5)`}>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={Number(outerRadius) + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.25))" }}
      />
    </g>
  );
}

export default function DashboardPage() {
  const [hideBalance, setHideBalance] = useState(false);
  const [performanceRange, setPerformanceRange] = useState<PerformanceTimeRange>("1W");
  const [selectedTxDetails, setSelectedTxDetails] = useState<ClientTransaction | null>(null);
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [activeAllocationIndex, setActiveAllocationIndex] = useState<number | undefined>(undefined);
  
  // Dashboard content from CMS
  const [portfolioLabel, setPortfolioLabel] = useState("Total Portfolio Value");
  const [timeframeLabel, setTimeframeLabel] = useState("this month");
  const [cadBalanceLabel, setCadBalanceLabel] = useState("CAD Balance");
  const [depositBtn, setDepositBtn] = useState("Deposit");
  const [withdrawBtn, setWithdrawBtn] = useState("Withdraw");
  const [perfTitle, setPerfTitle] = useState("Portfolio Performance");
  const [dateFrom, setDateFrom] = useState("From date");
  const [dateTo, setDateTo] = useState("To date");
  const [tooltipCad, setTooltipCad] = useState("CAD Value");
  const [allocTitle, setAllocTitle] = useState("Asset Allocation");
  const [emptyAssetsTitle, setEmptyAssetsTitle] = useState("No assets yet");
  const [emptyAssetsSub, setEmptyAssetsSub] = useState("Deposit to see your allocation");
  const [emptyWalletsTitle, setEmptyWalletsTitle] = useState("No wallets yet");
  const [emptyWalletsSub, setEmptyWalletsSub] = useState("Make a deposit to get started");
  const [txTitle, setTxTitle] = useState("Recent Transactions");
  const [txViewAll, setTxViewAll] = useState("View All");
  const [txLoading, setTxLoading] = useState("Loading transactions...");
  const [emptyTx, setEmptyTx] = useState("No recent transactions");
  
  const { data: metrics, isLoading: loadingBalance } = useDashboardMetrics();
  const { data: transactions = [], isLoading: loadingTx } = useRecentTransactions();
  const { data: allTransactions = [] } = useClientTransactions();
  const supabase = createClient();

  // Fetch dashboard content from site_content
  useEffect(() => {
    async function loadDashboardContent() {
      try {
        const { data, error } = await supabase
          .from("site_content")
          .select("key, value")
          .eq("category", "dashboard");
        
        if (!error && data) {
          data.forEach((row) => {
            switch (row.key) {
              case "dashboard.top_header.portfolio_label":
                setPortfolioLabel(row.value);
                break;
              case "dashboard.top_header.timeframe_label":
                setTimeframeLabel(row.value);
                break;
              case "dashboard.top_header.cad_balance_label":
                setCadBalanceLabel(row.value);
                break;
              case "dashboard.top_header.deposit_btn":
                setDepositBtn(row.value);
                break;
              case "dashboard.top_header.withdraw_btn":
                setWithdrawBtn(row.value);
                break;
              case "dashboard.performance.title":
                setPerfTitle(row.value);
                break;
              case "dashboard.performance.from_placeholder":
                setDateFrom(row.value);
                break;
              case "dashboard.performance.to_placeholder":
                setDateTo(row.value);
                break;
              case "dashboard.performance.tooltip_label":
                setTooltipCad(row.value);
                break;
              case "dashboard.allocation.title":
                setAllocTitle(row.value);
                break;
              case "dashboard.allocation.empty_title":
                setEmptyAssetsTitle(row.value);
                break;
              case "dashboard.allocation.empty_sub":
                setEmptyAssetsSub(row.value);
                break;
              case "dashboard.wallets.empty_title":
                setEmptyWalletsTitle(row.value);
                break;
              case "dashboard.wallets.empty_sub":
                setEmptyWalletsSub(row.value);
                break;
              case "dashboard.transactions.title":
                setTxTitle(row.value);
                break;
              case "dashboard.transactions.view_all":
                setTxViewAll(row.value);
                break;
              case "dashboard.transactions.loading":
                setTxLoading(row.value);
                break;
              case "dashboard.transactions.empty":
                setEmptyTx(row.value);
                break;
              default:
                break;
            }
          });
        }
      } catch (err) {
        console.error("Error loading dashboard content:", err);
      }
    }
    loadDashboardContent();
  }, [supabase]);

  const cadRates = useMemo((): Record<string, number> => ({
    BTC: metrics?.cadRates?.BTC ?? 95000,
    ETH: metrics?.cadRates?.ETH ?? 3500,
    USDT: metrics?.cadRates?.USDT ?? 1.36,
  }), [metrics?.cadRates]);
  const wallets = useMemo(() => metrics?.wallets ?? [], [metrics?.wallets]);
  const visibleWallets = useMemo(() => {
    return wallets.filter((w) => {
      const isCAD = w.currency === 'CAD';
      const value = isCAD ? w.balance : w.balance * (cadRates[w.currency] || cadRates.USDT || 1.36);
      return value >= 0.005;
    });
  }, [wallets, cadRates]);
  const portfolioValue = metrics?.portfolioValue ?? 0;
  const cadBalance = metrics?.cadBalance ?? 0;
  const thisMonthDeposits = metrics?.thisMonthDeposits ?? 0;
  const percentChange = metrics?.percentChange ?? 0;

  const allocationData = useMemo(() => {
    const buildItem = (symbol: string, value: number) => {
      const grad = ASSET_GRADIENTS[symbol] || buildAssetGradient(symbol);
      return {
        name: grad.label,
        symbol,
        value,
        gradientId: grad.id,
        dotColor: grad.dot,
      };
    };

    if (portfolioValue === 0 || visibleWallets.length === 0) {
      return [];
    }

    return visibleWallets.map((w) => {
      // If CAD, use balance directly (no conversion needed)
      const isCAD = w.currency === 'CAD';
      const value = isCAD ? w.balance : w.balance * (cadRates[w.currency] || cadRates.USDT || 1.36);
      return buildItem(w.currency, value);
    }).filter((item) => item.value > 0);
  }, [visibleWallets, cadRates, portfolioValue]);

  const allocationTotal = useMemo(
    () => allocationData.reduce((sum, item) => sum + item.value, 0),
    [allocationData],
  );

  const chartPerformanceData = useMemo(
    () =>
      buildPerformanceChartData(
        allTransactions,
        performanceRange,
        portfolioValue,
        cadRates,
        performanceRange === "Custom" ? customStartDate : null,
        performanceRange === "Custom" ? customEndDate : null,
      ),
    [
      allTransactions,
      performanceRange,
      portfolioValue,
      cadRates,
      customStartDate,
      customEndDate,
    ],
  );

  const yAxisDomain = useMemo(() => {
    const values = chartPerformanceData.map((point) => point.value);
    if (values.length === 0) return [0, 100];
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    // If flat line (all same value), provide meaningful padding around it
    if (minValue === maxValue) {
      if (minValue === 0) return [0, 100];
      return [minValue * 0.85, maxValue * 1.15];
    }
    return [minValue * 0.9, maxValue * 1.1];
  }, [chartPerformanceData]);

  const formatYAxisTick = (value: number) => {
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
    return `$${value.toFixed(0)}`;
  };

  const formatCadTooltip = (value: number) =>
    `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const renderAllocationLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: {
    cx?: number;
    cy?: number;
    midAngle?: number;
    innerRadius?: number;
    outerRadius?: number;
    percent?: number;
  }) => {
    if (!cx || !cy || !midAngle || !innerRadius || !outerRadius || !percent || percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-[10px] font-bold"
        style={{ pointerEvents: "none" }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#1855C0] rounded-2xl p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[13px] text-blue-100/90 font-medium">{portfolioLabel}</span>
              <button
                onClick={() => setHideBalance(!hideBalance)}
                className="hover:text-white text-blue-100/80 transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
            <h1 className="text-4xl md:text-[44px] font-bold tracking-tight mb-2">
              {hideBalance ? (
                "$••,•••.••"
              ) : loadingBalance ? (
                <div className="h-8 w-48 bg-gray-200 animate-pulse rounded" />
              ) : (
                `$${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              )}
            </h1>
            <div className="flex items-center gap-1.5 text-[14px]">
              <TrendingUp
                className={cn("w-4 h-4", percentChange >= 0 ? "text-[#FFD166]" : "text-red-400")}
              />
              <span
                className={cn(
                  "font-semibold",
                  percentChange >= 0 ? "text-[#FFD166]" : "text-red-400",
                )}
              >
                {percentChange >= 0 ? "+" : "-"}$
                {Math.abs(thisMonthDeposits).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                ({percentChange >= 0 ? "+" : ""}
                {percentChange.toFixed(1)}%)
              </span>
              <span className="text-blue-200/80">{timeframeLabel}</span>
            </div>
          </div>
          <div className="md:text-right">
            <span className="text-[13px] text-blue-100/90 font-medium">{cadBalanceLabel}</span>
            <div className="text-xl md:text-2xl font-bold mt-1">
              {hideBalance ? (
                "$•,•••.••"
              ) : loadingBalance ? (
                <div className="h-8 w-48 bg-gray-200 animate-pulse rounded" />
              ) : (
                `$${cadBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <Link
            href="/deposit"
            className="flex items-center justify-center gap-2 bg-[#FFC107] hover:bg-[#FFD166] text-[#0A0F2C] rounded-xl py-3.5 font-bold text-[14px] transition-colors shadow-sm"
          >
            <ArrowDownLeft className="w-4 h-4" strokeWidth={2.5} />
            {depositBtn}
          </Link>
          <Link
            href="/withdraw"
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-xl py-3.5 font-bold text-[14px] transition-colors shadow-sm"
          >
            <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
            {withdrawBtn}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="rounded-2xl p-6 shadow-lg backdrop-blur-md bg-white/5 border border-white/10 bg-gradient-to-br from-[#1e3a8a]/95 to-[#0f172a]/90">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h2 className="text-[15px] font-bold text-white">{perfTitle}</h2>
            <div className="flex flex-wrap gap-1.5">
              {PERFORMANCE_TIME_RANGES.map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setPerformanceRange(range)}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[11px] font-bold transition-all",
                    performanceRange === range
                      ? "bg-[#2563eb] text-white shadow-md shadow-blue-500/30"
                      : "bg-transparent text-white/80 hover:text-white hover:bg-white/10",
                  )}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {performanceRange === "Custom" && (
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <DatePicker
                selected={customStartDate}
                onChange={(date: Date | null) => setCustomStartDate(date)}
                selectsStart
                startDate={customStartDate}
                endDate={customEndDate}
                maxDate={customEndDate || new Date()}
                placeholderText={dateFrom}
                className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs font-medium outline-none focus:border-[#60a5fa] w-[130px]"
                calendarClassName="!font-sans"
              />
              <span className="text-white/50 text-xs">→</span>
              <DatePicker
                selected={customEndDate}
                onChange={(date: Date | null) => setCustomEndDate(date)}
                selectsEnd
                startDate={customStartDate}
                endDate={customEndDate}
                minDate={customStartDate || undefined}
                maxDate={new Date()}
                placeholderText={dateTo}
                className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs font-medium outline-none focus:border-[#60a5fa] w-[130px]"
                calendarClassName="!font-sans"
              />
            </div>
          )}

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartPerformanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="performanceAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity={0} />
                  </linearGradient>
                  <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#60a5fa" floodOpacity="1" />
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  domain={yAxisDomain}
                  tickFormatter={formatYAxisTick}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.15)",
                    backgroundColor: "rgba(15, 23, 42, 0.92)",
                    backdropFilter: "blur(8px)",
                    color: "#f8fafc",
                  }}
                  labelStyle={{ color: "#94a3b8" }}
                  formatter={(value) => [
                    formatCadTooltip(typeof value === "number" ? value : 0),
                    tooltipCad,
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#60a5fa"
                  strokeWidth={2.5}
                  fill="url(#performanceAreaGradient)"
                  dot={false}
                  isAnimationActive
                  animationDuration={1200}
                  animationEasing="ease-out"
                  style={{ filter: "url(#lineGlow)" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
          <h2 className="text-[15px] font-bold text-[#0A0F2C] mb-4">{allocTitle}</h2>
          <div className="flex-1 flex flex-col justify-between">
            {allocationData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[200px] text-[#A0AEC0]">
                <svg className="w-12 h-12 mb-3 opacity-40" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 3v9l4 4" /></svg>
                <p className="text-sm font-medium">{emptyAssetsTitle}</p>
                <p className="text-xs mt-1 opacity-70">{emptyAssetsSub}</p>
              </div>
            ) : (
              <div className="h-[220px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={62}
                      outerRadius={92}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="#ffffff"
                      strokeWidth={3}
                      isAnimationActive
                      animationDuration={900}
                      animationEasing="ease-out"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {allocationData.map((entry) => (
                        <Cell key={entry.symbol} fill={entry.dotColor} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {allocationData.length > 0 && (
              <div className="mt-5 space-y-3">
                {allocationData.map((item, idx) => (
                  <div key={item.symbol}>
                    {idx > 0 && <div className="h-px bg-gray-100 mb-3" />}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.dotColor }}
                        />
                        <span className="text-[13px] font-medium text-[#374151]">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-[13px] font-bold text-[#111827]">
                        ${item.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleWallets.length > 0 ? visibleWallets.map((w) => {
          // If CAD, use balance directly (no conversion needed)
          const isCAD = w.currency === 'CAD';
          const value = isCAD ? w.balance : w.balance * (cadRates[w.currency] || cadRates.USDT || 1.36);
          const decimals = w.currency === "USDT" || w.currency === "USDC" || isCAD ? 2 : 8;
          const isStable = w.currency === "USDT" || w.currency === "USDC" || isCAD;
          return (
            <div key={w.currency} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <CoinLogo src={getCoinBySymbol(`${w.currency}USDT`)?.logoUrl} symbol={w.currency} className="h-10 w-10 p-1.5" />
                <div className={isStable ? "bg-gray-100 text-[#718096] px-2 py-0.5 rounded text-[11px] font-bold" : "bg-green-50 text-[#10B981] px-2 py-0.5 rounded text-[11px] font-bold border border-green-100"}>
                  {isStable ? (isCAD ? "Fiat" : "Stable") : "Live"}
                </div>
              </div>
              <h3 className="text-[15px] font-bold text-[#0A0F2C] mb-1">{w.currency}</h3>
              <div className="text-[20px] font-bold text-[#0A0F2C] mb-0.5">
                ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-[11px] text-[#A0AEC0] font-medium">
                {w.balance.toLocaleString(undefined, { maximumFractionDigits: decimals })} {w.currency}
              </div>
            </div>
          );
        }) : (
          <div className="md:col-span-3 bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <svg className="w-12 h-12 mb-3 text-[#A0AEC0] opacity-50" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>
            <p className="text-sm font-semibold text-[#4A5568]">{emptyWalletsTitle}</p>
            <p className="text-xs text-[#A0AEC0] mt-1">{emptyWalletsSub}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[15px] font-bold text-[#0A0F2C]">{txTitle}</h2>
          <Link href="/transactions" className="text-[12px] font-bold text-[#4A5568] hover:text-[#0A0F2C] transition-colors">
            {txViewAll}
          </Link>
        </div>

        <div className="space-y-4">
          {loadingTx ? (
            <div className="py-6 text-center text-sm text-[#718096]">{txLoading}</div>
          ) : transactions.length === 0 ? (
            <div className="py-6 text-center text-sm text-[#718096]">{emptyTx}</div>
          ) : (
            transactions.map((tx, index) => {
              const isDeposit = tx.type === "Deposit";
              const dateStr = formatRelativeTime(tx.date);
              return (
                <React.Fragment key={tx.id}>
                  {index > 0 && <div className="h-px bg-gray-100 w-full" />}
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          isDeposit ? "bg-green-50" : "bg-blue-50",
                        )}
                      >
                        {isDeposit ? (
                          <ArrowDownLeft className="w-5 h-5 text-[#10B981]" strokeWidth={2.5} />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-[#113285]" strokeWidth={2.5} />
                        )}
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-[#0A0F2C]">
                          {tx.type}{" "}
                          {tx.status !== "approved" && tx.status !== "completed" && (
                            <span className="text-[10px] font-semibold text-[#718096] bg-gray-100 px-1.5 py-0.5 rounded ml-1.5 uppercase">
                              {tx.status}
                            </span>
                          )}
                          {(tx.status === "pending" || tx.status === "rejected") && (
                            <button
                              onClick={() => setSelectedTxDetails(tx)}
                              className="text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded ml-1.5 transition-colors inline-flex items-center gap-1 uppercase"
                            >
                              <Info className="w-3 h-3" />
                              View Details
                            </button>
                          )}
                        </div>
                        <div className="text-[12px] text-[#718096]">{tx.asset}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={cn(
                          "text-[14px] font-bold",
                          isDeposit ? "text-[#10B981]" : "text-[#0A0F2C]",
                        )}
                      >
                        {isDeposit ? "+" : "-"}
                        {tx.amount.toLocaleString()} {tx.asset}
                      </div>
                      <div className="text-[12px] text-[#A0AEC0]">{dateStr}</div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          )}
        </div>
      </div>

      {selectedTxDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedTxDetails(null)}
        >
          <div
            className="w-full max-w-md rounded-[20px] border border-gray-100 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-[#0A0F2C]">Transaction Details</h2>
              <button
                type="button"
                onClick={() => setSelectedTxDetails(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-[#718096] hover:bg-gray-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-wide text-[#718096]">Amount</p>
                <p className="mt-1 text-[14px] font-bold text-[#0A0F2C]">
                  {selectedTxDetails.asset !== "CAD" && selectedTxDetails.asset !== "USD"
                    ? `${Number(selectedTxDetails.amount).toFixed(6)} ${selectedTxDetails.asset} ($${(Number(selectedTxDetails.amount) * (metrics?.cadRates?.[selectedTxDetails.asset] || 1)).toFixed(2)} CAD)`
                    : `${selectedTxDetails.amount} ${selectedTxDetails.asset}`}
                </p>
              </div>

              <div>
                <p className="text-[12px] font-semibold uppercase tracking-wide text-[#718096]">
                  Total Balance Before {selectedTxDetails.type}
                </p>
                <p className="mt-1 text-[14px] font-bold text-[#0A0F2C]">
                  ${(
                    (metrics?.cadBalance || 0) +
                    (selectedTxDetails.type.toLowerCase() === "withdrawal"
                      ? (selectedTxDetails.status === "approved" || selectedTxDetails.status === "completed" ? Number(selectedTxDetails.amount) : 0)
                      : (selectedTxDetails.status === "approved" || selectedTxDetails.status === "completed" ? -Number(selectedTxDetails.amount) : 0)
                    )
                  ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD
                </p>
              </div>

              <div>
                <p className="text-[12px] font-semibold uppercase tracking-wide text-[#718096]">
                  {selectedTxDetails.type.toLowerCase() === "withdrawal" ? "Remaining" : "New"} Available Balance
                </p>
                <p className="mt-1 text-[14px] font-bold text-[#0A0F2C]">
                  ${(
                    (metrics?.cadBalance || 0) +
                    (selectedTxDetails.type.toLowerCase() === "withdrawal"
                      ? (selectedTxDetails.status === "pending" || selectedTxDetails.status === "rejected" ? -Number(selectedTxDetails.amount) : 0)
                      : (selectedTxDetails.status === "pending" || selectedTxDetails.status === "rejected" ? Number(selectedTxDetails.amount) : 0)
                    )
                  ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD
                </p>
              </div>
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-wide text-[#718096]">Status</p>
                <div className="mt-1">
                  <span className={cn(
                    "inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase",
                    selectedTxDetails.status === "completed" || selectedTxDetails.status === "approved" ? "bg-green-50 text-green-700" :
                      selectedTxDetails.status === "rejected" ? "bg-red-50 text-red-700" :
                        "bg-orange-50 text-orange-700"
                  )}>
                    {selectedTxDetails.status}
                  </span>
                </div>
              </div>

              {selectedTxDetails.status === "rejected" && (selectedTxDetails.rejectionReason || selectedTxDetails.adminNote) && (
                <div className="rounded-xl bg-red-50 p-4 border border-red-100 mt-6">
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-red-800 mb-1">Rejection Reason</p>
                  <p className="text-[14px] text-red-900 leading-relaxed">
                    {selectedTxDetails.rejectionReason || selectedTxDetails.adminNote}
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
