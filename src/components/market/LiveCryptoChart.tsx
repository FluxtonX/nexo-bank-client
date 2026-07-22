"use client";

import * as React from "react";
import {
  CandlestickSeries,
  ColorType,
  createChart,
  HistogramSeries,
  IChartApi,
  ISeriesApi,
  LineSeries,
  LineStyle,
  Time,
} from "lightweight-charts";
import {
  Brush,
  CandlestickChart,
  Check,
  Crosshair,
  Eye,
  LineChart,
  Loader2,
  Lock,
  Magnet,
  Maximize2,
  MousePointer2,
  Network,
  Palette,
  Pencil,
  RotateCcw,
  Ruler,
  Settings2,
  Type,
  WifiOff,
  ZoomIn,
} from "lucide-react";
import { COINS, getCoinBySymbol, isSupportedInterval, isSupportedSymbol, SupportedInterval } from "@/config/coins";
import { cn } from "@/lib/utils";
import { CoinLogo } from "./CoinLogo";
import { TimeframeSelector } from "./TimeframeSelector";

type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type BinanceKlineMessage = {
  e: string;
  s: string;
  k: {
    t: number;
    o: string;
    h: string;
    l: string;
    c: string;
    v: string;
    x: boolean;
  };
};

type LiveCryptoChartProps = {
  symbol: string;
  defaultInterval?: string;
  previewMode?: boolean;
  onOpenPreview?: () => void;
  onIntervalChange?: (interval: SupportedInterval) => void;
  onLatestCandleChange?: (candle: Candle) => void;
};

type IndicatorId = "sma20" | "ema20" | "vwap";
type ChartStyle = "candles" | "line";

type ChartSettings = {
  style: ChartStyle;
  showGrid: boolean;
  showVolume: boolean;
  showCrosshair: boolean;
  autoFit: boolean;
  upColor: string;
  downColor: string;
};

const INDICATORS: Array<{ id: IndicatorId; label: string; color: string }> = [
  { id: "sma20", label: "SMA 20", color: "#113285" },
  { id: "ema20", label: "EMA 20", color: "#7C3AED" },
  { id: "vwap", label: "VWAP", color: "#0F766E" },
];

const DEFAULT_CHART_SETTINGS: ChartSettings = {
  style: "candles",
  showGrid: true,
  showVolume: true,
  showCrosshair: true,
  autoFit: true,
  upColor: "#16a66f",
  downColor: "#ef4444",
};

const CHART_SETTINGS_STORAGE_KEY = "north-union-chart-settings";

function readStoredChartSettings(): ChartSettings {
  if (typeof window === "undefined") return DEFAULT_CHART_SETTINGS;

  try {
    const raw = window.localStorage.getItem(CHART_SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_CHART_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<ChartSettings>;
    return {
      ...DEFAULT_CHART_SETTINGS,
      ...parsed,
      style: parsed.style === "line" ? "line" : "candles",
    };
  } catch {
    return DEFAULT_CHART_SETTINGS;
  }
}

const DRAWING_TOOLS = [
  { id: "crosshair", label: "Crosshair", icon: Crosshair },
  { id: "trend", label: "Trend line", icon: LineChart },
  { id: "brush", label: "Brush", icon: Brush },
  { id: "pattern", label: "Pattern", icon: Network },
  { id: "text", label: "Text", icon: Type },
  { id: "magnet", label: "Magnet", icon: Magnet },
  { id: "measure", label: "Measure", icon: Ruler },
  { id: "zoom", label: "Zoom", icon: ZoomIn },
  { id: "draw", label: "Drawing lock", icon: Pencil },
  { id: "lock", label: "Lock drawings", icon: Lock },
  { id: "preview", label: "Preview", icon: Eye },
];

function toSeriesCandle(candle: Candle) {
  return {
    time: candle.time as Time,
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close,
  };
}

function toVolumeBar(candle: Candle) {
  return {
    time: candle.time as Time,
    value: candle.volume,
    color: candle.close >= candle.open ? "rgba(22,166,111,0.22)" : "rgba(239,68,68,0.22)",
  };
}

function parseSocketCandle(message: BinanceKlineMessage): Candle {
  return {
    time: Math.floor(message.k.t / 1000),
    open: Number(message.k.o),
    high: Number(message.k.h),
    low: Number(message.k.l),
    close: Number(message.k.c),
    volume: Number(message.k.v),
  };
}

function calculateSma(candles: Candle[], period: number) {
  return candles
    .map((candle, index) => {
      if (index < period - 1) return null;
      const window = candles.slice(index - period + 1, index + 1);
      return {
        time: candle.time as Time,
        value: window.reduce((sum, item) => sum + item.close, 0) / period,
      };
    })
    .filter((point): point is { time: Time; value: number } => point !== null);
}

function calculateEma(candles: Candle[], period: number) {
  const multiplier = 2 / (period + 1);
  let ema = candles[0]?.close ?? 0;
  return candles.map((candle, index) => {
    ema = index === 0 ? candle.close : candle.close * multiplier + ema * (1 - multiplier);
    return { time: candle.time as Time, value: ema };
  });
}

function calculateVwap(candles: Candle[]) {
  let cumulativePriceVolume = 0;
  let cumulativeVolume = 0;

  return candles.map((candle) => {
    const typicalPrice = (candle.high + candle.low + candle.close) / 3;
    cumulativePriceVolume += typicalPrice * candle.volume;
    cumulativeVolume += candle.volume;
    return {
      time: candle.time as Time,
      value: cumulativeVolume > 0 ? cumulativePriceVolume / cumulativeVolume : typicalPrice,
    };
  });
}

export function LiveCryptoChart({
  symbol,
  defaultInterval = "1h",
  previewMode = false,
  onOpenPreview,
  onIntervalChange,
  onLatestCandleChange,
}: LiveCryptoChartProps) {
  const normalizedSymbol = symbol.toUpperCase();
  const initialInterval = isSupportedInterval(defaultInterval) ? defaultInterval : "1h";
  const [interval, setInterval] = React.useState<SupportedInterval>(initialInterval);
  const [candles, setCandles] = React.useState<Candle[]>([]);
  const [latestCandle, setLatestCandle] = React.useState<Candle | null>(null);
  const [activeTool, setActiveTool] = React.useState("crosshair");
  const [selectedIndicators, setSelectedIndicators] = React.useState<IndicatorId[]>([]);
  const [indicatorMenuOpen, setIndicatorMenuOpen] = React.useState(false);
  const [compareMenuOpen, setCompareMenuOpen] = React.useState(false);
  const [compareSymbol, setCompareSymbol] = React.useState<string | null>(null);
  const [compareCandles, setCompareCandles] = React.useState<Candle[]>([]);
  const [intervalMenuOpen, setIntervalMenuOpen] = React.useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = React.useState(false);
  const [chartSettings, setChartSettings] = React.useState<ChartSettings>(() => readStoredChartSettings());
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [connected, setConnected] = React.useState(false);

  const hostRef = React.useRef<HTMLDivElement>(null);
  const chartRef = React.useRef<IChartApi | null>(null);
  const candleSeriesRef = React.useRef<ISeriesApi<"Candlestick"> | null>(null);
  const closeLineSeriesRef = React.useRef<ISeriesApi<"Line"> | null>(null);
  const volumeSeriesRef = React.useRef<ISeriesApi<"Histogram"> | null>(null);
  const smaSeriesRef = React.useRef<ISeriesApi<"Line"> | null>(null);
  const emaSeriesRef = React.useRef<ISeriesApi<"Line"> | null>(null);
  const vwapSeriesRef = React.useRef<ISeriesApi<"Line"> | null>(null);
  const compareSeriesRef = React.useRef<ISeriesApi<"Line"> | null>(null);

  const coin = getCoinBySymbol(normalizedSymbol);
  const pairLabel = coin?.pairLabel ?? normalizedSymbol;

  React.useEffect(() => {
    if (isSupportedInterval(defaultInterval)) {
      setInterval(defaultInterval);
    }
  }, [defaultInterval]);

  React.useEffect(() => {
    try {
      window.localStorage.setItem(CHART_SETTINGS_STORAGE_KEY, JSON.stringify(chartSettings));
    } catch {
    }
  }, [chartSettings]);

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const chart = createChart(host, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: "#ffffff" },
        textColor: "#0A0F2C",
        fontFamily: "Inter, Arial, sans-serif",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "#edf1f7", style: LineStyle.Solid },
        horzLines: { color: "#edf1f7", style: LineStyle.Solid },
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: { top: 0.12, bottom: 0.18 },
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 8,
        barSpacing: previewMode ? 14 : 10,
        minBarSpacing: 2,
        fixLeftEdge: false,
        fixRightEdge: false,
      },
      crosshair: {
        mode: 0,
        vertLine: { color: "#113285", labelBackgroundColor: "#113285" },
        horzLine: { color: "#113285", labelBackgroundColor: "#113285" },
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: DEFAULT_CHART_SETTINGS.upColor,
      downColor: DEFAULT_CHART_SETTINGS.downColor,
      borderUpColor: DEFAULT_CHART_SETTINGS.upColor,
      borderDownColor: DEFAULT_CHART_SETTINGS.downColor,
      wickUpColor: DEFAULT_CHART_SETTINGS.upColor,
      wickDownColor: DEFAULT_CHART_SETTINGS.downColor,
      priceFormat: { type: "price", precision: 2, minMove: 0.01 },
      visible: DEFAULT_CHART_SETTINGS.style === "candles",
    });

    const closeLineSeries = chart.addSeries(LineSeries, {
      color: "#113285",
      lineWidth: 2,
      priceLineVisible: true,
      visible: DEFAULT_CHART_SETTINGS.style === "line",
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
      visible: DEFAULT_CHART_SETTINGS.showVolume,
    });
    chart.priceScale("volume").applyOptions({ scaleMargins: { top: 0.82, bottom: 0 } });

    const smaSeries = chart.addSeries(LineSeries, {
      color: "#113285",
      lineWidth: 2,
      priceLineVisible: false,
      visible: false,
    });

    const emaSeries = chart.addSeries(LineSeries, {
      color: "#7C3AED",
      lineWidth: 2,
      priceLineVisible: false,
      visible: false,
    });

    const vwapSeries = chart.addSeries(LineSeries, {
      color: "#0F766E",
      lineWidth: 2,
      priceLineVisible: false,
      visible: false,
    });

    const compareSeries = chart.addSeries(LineSeries, {
      color: "#F5A400",
      lineWidth: 2,
      priceScaleId: "compare",
      priceLineVisible: false,
      visible: false,
    });
    chart.priceScale("compare").applyOptions({
      visible: false,
      scaleMargins: { top: 0.12, bottom: 0.18 },
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    closeLineSeriesRef.current = closeLineSeries;
    volumeSeriesRef.current = volumeSeries;
    smaSeriesRef.current = smaSeries;
    emaSeriesRef.current = emaSeries;
    vwapSeriesRef.current = vwapSeries;
    compareSeriesRef.current = compareSeries;

    return () => {
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      closeLineSeriesRef.current = null;
      volumeSeriesRef.current = null;
      smaSeriesRef.current = null;
      emaSeriesRef.current = null;
      vwapSeriesRef.current = null;
      compareSeriesRef.current = null;
    };
  }, [previewMode]);

  React.useEffect(() => {
    chartRef.current?.applyOptions({
      grid: {
        vertLines: { color: chartSettings.showGrid ? "#edf1f7" : "transparent", style: LineStyle.Solid },
        horzLines: { color: chartSettings.showGrid ? "#edf1f7" : "transparent", style: LineStyle.Solid },
      },
      crosshair: {
        mode: 0,
        vertLine: {
          visible: chartSettings.showCrosshair,
          color: "#113285",
          labelBackgroundColor: "#113285",
        },
        horzLine: {
          visible: chartSettings.showCrosshair,
          color: "#113285",
          labelBackgroundColor: "#113285",
        },
      },
    });
    candleSeriesRef.current?.applyOptions({
      upColor: chartSettings.upColor,
      downColor: chartSettings.downColor,
      borderUpColor: chartSettings.upColor,
      borderDownColor: chartSettings.downColor,
      wickUpColor: chartSettings.upColor,
      wickDownColor: chartSettings.downColor,
      visible: chartSettings.style === "candles",
    });
    closeLineSeriesRef.current?.applyOptions({ visible: chartSettings.style === "line" });
    volumeSeriesRef.current?.applyOptions({ visible: chartSettings.showVolume });
  }, [chartSettings]);

  React.useEffect(() => {
    smaSeriesRef.current?.setData(calculateSma(candles, 20));
    emaSeriesRef.current?.setData(calculateEma(candles, 20));
    vwapSeriesRef.current?.setData(calculateVwap(candles));
    smaSeriesRef.current?.applyOptions({ visible: selectedIndicators.includes("sma20") });
    emaSeriesRef.current?.applyOptions({ visible: selectedIndicators.includes("ema20") });
    vwapSeriesRef.current?.applyOptions({ visible: selectedIndicators.includes("vwap") });
  }, [candles, selectedIndicators]);

  React.useEffect(() => {
    compareSeriesRef.current?.setData(
      compareCandles.map((candle) => ({
        time: candle.time as Time,
        value: candle.close,
      })),
    );
    compareSeriesRef.current?.applyOptions({ visible: Boolean(compareSymbol && compareCandles.length > 0) });
  }, [compareCandles, compareSymbol]);

  React.useEffect(() => {
    if (!compareSymbol) {
      setCompareCandles([]);
      return;
    }

    const activeCompareSymbol = compareSymbol;
    const controller = new AbortController();
    let socket: WebSocket | null = null;

    async function loadCompareCandles() {
      try {
        const response = await fetch(`/api/market/candles?symbol=${activeCompareSymbol}&interval=${interval}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Failed to load compare symbol");
        const payload = (await response.json()) as { candles: Candle[] };
        setCompareCandles(payload.candles);

        socket = new WebSocket(`wss://data-stream.binance.vision:443/ws/${activeCompareSymbol.toLowerCase()}@kline_${interval}`);
        socket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data as string) as BinanceKlineMessage;
            if (message.e !== "kline" || message.s !== activeCompareSymbol) return;
            const updated = parseSocketCandle(message);
            setCompareCandles((current) => {
              const existingIndex = current.findIndex((item) => item.time === updated.time);
              if (existingIndex === -1) return [...current.slice(-499), updated];
              const next = [...current];
              next[existingIndex] = updated;
              return next;
            });
          } catch {
          }
        };
      } catch {
        if (!controller.signal.aborted) {
          setCompareCandles([]);
        }
      }
    }

    loadCompareCandles();

    return () => {
      controller.abort();
      if (socket) {
        socket.onmessage = null;
        socket.close();
      }
    };
  }, [compareSymbol, interval]);

  React.useEffect(() => {
    if (!isSupportedSymbol(normalizedSymbol)) {
      setError("Unsupported market symbol");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    let socket: WebSocket | null = null;
    let ignore = false;

    async function loadCandles() {
      setLoading(true);
      setError(null);
      setConnected(false);

      try {
        const response = await fetch(`/api/market/candles?symbol=${normalizedSymbol}&interval=${interval}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(payload?.error ?? "Failed to load chart candles");
        }

        const payload = (await response.json()) as { candles: Candle[] };
        if (ignore) return;

        const nextCandles = payload.candles;
        setCandles(nextCandles);
        const latest = nextCandles[nextCandles.length - 1] ?? null;
        setLatestCandle(latest);
        if (latest) onLatestCandleChange?.(latest);

        candleSeriesRef.current?.setData(nextCandles.map(toSeriesCandle));
        closeLineSeriesRef.current?.setData(
          nextCandles.map((candle) => ({
            time: candle.time as Time,
            value: candle.close,
          })),
        );
        volumeSeriesRef.current?.setData(nextCandles.map(toVolumeBar));
        if (chartSettings.autoFit) {
          chartRef.current?.timeScale().fitContent();
        }

        socket = new WebSocket(`wss://data-stream.binance.vision:443/ws/${normalizedSymbol.toLowerCase()}@kline_${interval}`);
        socket.onopen = () => setConnected(true);
        socket.onerror = () => {
          setConnected(false);
          setError("Realtime market stream connection failed");
        };
        socket.onclose = () => setConnected(false);
        socket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data as string) as BinanceKlineMessage;
            if (message.e !== "kline" || message.s !== normalizedSymbol) return;

            const updated = parseSocketCandle(message);
            setLatestCandle(updated);
            onLatestCandleChange?.(updated);
            candleSeriesRef.current?.update(toSeriesCandle(updated));
            closeLineSeriesRef.current?.update({ time: updated.time as Time, value: updated.close });
            volumeSeriesRef.current?.update(toVolumeBar(updated));
            setCandles((current) => {
              const existingIndex = current.findIndex((item) => item.time === updated.time);
              if (existingIndex === -1) return [...current.slice(-499), updated];
              const next = [...current];
              next[existingIndex] = updated;
              return next;
            });
          } catch {
            setError("Realtime market stream returned invalid data");
          }
        };
      } catch (requestError) {
        if (controller.signal.aborted) return;
        const message = requestError instanceof Error ? requestError.message : "Failed to load chart";
        setError(message);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadCandles();

    return () => {
      ignore = true;
      controller.abort();
      if (socket) {
        socket.onopen = null;
        socket.onmessage = null;
        socket.onerror = null;
        socket.onclose = null;
        socket.close();
      }
    };
  }, [chartSettings.autoFit, interval, normalizedSymbol, onLatestCandleChange]);

  function handleIntervalChange(nextInterval: SupportedInterval) {
    setInterval(nextInterval);
    setIntervalMenuOpen(false);
    onIntervalChange?.(nextInterval);
  }

  function handleToolChange(tool: string) {
    setActiveTool(tool);
    if (tool === "preview") {
      onOpenPreview?.();
    }
  }

  function toggleIndicator(indicator: IndicatorId) {
    setSelectedIndicators((current) =>
      current.includes(indicator)
        ? current.filter((item) => item !== indicator)
        : [...current, indicator],
    );
  }

  function updateChartSetting<T extends keyof ChartSettings>(key: T, value: ChartSettings[T]) {
    setChartSettings((current) => ({ ...current, [key]: value }));
  }

  function resetChartSettings() {
    setChartSettings(DEFAULT_CHART_SETTINGS);
    chartRef.current?.timeScale().fitContent();
  }

  const headerCandle = latestCandle ?? candles[candles.length - 1] ?? null;

  return (
    <div className={cn("relative overflow-visible rounded-md border border-slate-200 bg-white", previewMode ? "h-full min-h-[560px]" : "h-[500px] min-h-[460px]")}>
      <div className="absolute left-0 top-0 z-30 flex h-full w-[54px] flex-col items-center overflow-y-auto border-r border-slate-100 bg-white/95 py-3">
        {DRAWING_TOOLS.map((tool) => {
          const Icon = tool.icon;
          const active = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              type="button"
              title={tool.label}
              aria-label={tool.label}
              aria-pressed={active}
              onClick={() => handleToolChange(tool.id)}
              className={cn(
                "mb-1 grid h-8 w-8 shrink-0 place-items-center rounded-md text-slate-600 transition-colors hover:bg-blue-50 hover:text-[#113285]",
                active && "bg-blue-50 text-[#113285] ring-1 ring-blue-200",
              )}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </div>

      <div className="absolute left-[54px] right-0 top-0 z-40 flex h-[58px] items-center justify-between gap-3 overflow-visible border-b border-slate-100 bg-white/95 px-3">
        <div className="flex min-w-0 items-center gap-1.5 overflow-visible">
          <button
            type="button"
            title="Pointer"
            onClick={() => handleToolChange("pointer")}
            className={cn(
              "grid h-8 w-8 shrink-0 place-items-center rounded-md text-slate-600 hover:bg-slate-100",
              activeTool === "pointer" && "bg-blue-50 text-[#113285] ring-1 ring-blue-200",
            )}
          >
            <MousePointer2 className="h-4 w-4" />
          </button>
          <TimeframeSelector
            interval={interval}
            menuOpen={intervalMenuOpen}
            onIntervalChange={handleIntervalChange}
            onMenuToggle={() => setIntervalMenuOpen((value) => !value)}
          />
          <button type="button" title="Candles" className="ml-2 grid h-8 w-8 shrink-0 place-items-center rounded-md text-emerald-600 hover:bg-emerald-50">
            <CandlestickChart className="h-4 w-4" />
          </button>
          <div className="relative shrink-0">
            <button
              type="button"
              title="Chart settings"
              aria-label="Open chart settings"
              aria-expanded={settingsMenuOpen}
              onClick={() => {
                setSettingsMenuOpen((value) => !value);
                setIndicatorMenuOpen(false);
                setCompareMenuOpen(false);
                setIntervalMenuOpen(false);
              }}
              className={cn(
                "grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100",
                settingsMenuOpen && "bg-blue-50 text-[#113285]",
              )}
            >
              <Settings2 className="h-4 w-4" />
            </button>

            {settingsMenuOpen && (
              <div className="absolute left-0 top-10 z-[90] w-[280px] rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-[#718096]">Chart Settings</p>
                    <p className="mt-0.5 text-xs font-semibold text-slate-500">Saved locally for this browser</p>
                  </div>
                  <button
                    type="button"
                    title="Reset chart settings"
                    onClick={resetChartSettings}
                    className="grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-[#113285]"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="mb-2 text-xs font-black text-[#0A0F2C]">Chart Type</p>
                    <div className="grid grid-cols-2 rounded-lg bg-slate-100 p-1">
                      {(["candles", "line"] as ChartStyle[]).map((style) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => updateChartSetting("style", style)}
                          className={cn(
                            "rounded-md px-3 py-2 text-xs font-black capitalize transition-colors",
                            chartSettings.style === style ? "bg-white text-[#113285] shadow-sm" : "text-slate-500 hover:text-[#0A0F2C]",
                          )}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ["showGrid", "Grid"],
                      ["showVolume", "Volume"],
                      ["showCrosshair", "Crosshair"],
                      ["autoFit", "Auto Fit"],
                    ].map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => updateChartSetting(key as keyof ChartSettings, !chartSettings[key as keyof ChartSettings] as never)}
                        className={cn(
                          "flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-black transition-colors",
                          chartSettings[key as keyof ChartSettings] ? "border-blue-200 bg-blue-50 text-[#113285]" : "border-slate-200 text-slate-600 hover:bg-slate-50",
                        )}
                      >
                        {label}
                        {chartSettings[key as keyof ChartSettings] && <Check className="h-3.5 w-3.5" />}
                      </button>
                    ))}
                  </div>

                  <div>
                    <div className="mb-2 flex items-center gap-2 text-xs font-black text-[#0A0F2C]">
                      <Palette className="h-4 w-4 text-[#113285]" />
                      Candle Colors
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="space-y-1 text-xs font-bold text-slate-600">
                        Up
                        <input
                          type="color"
                          value={chartSettings.upColor}
                          onChange={(event) => updateChartSetting("upColor", event.target.value)}
                          className="h-9 w-full cursor-pointer rounded-md border border-slate-200 bg-white p-1"
                        />
                      </label>
                      <label className="space-y-1 text-xs font-bold text-slate-600">
                        Down
                        <input
                          type="color"
                          value={chartSettings.downColor}
                          onChange={(event) => updateChartSetting("downColor", event.target.value)}
                          className="h-9 w-full cursor-pointer rounded-md border border-slate-200 bg-white p-1"
                        />
                      </label>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => chartRef.current?.timeScale().fitContent()}
                    className="w-full rounded-lg bg-[#113285] px-3 py-2 text-xs font-black text-white transition-colors hover:bg-[#0D266A]"
                  >
                    Fit Chart To Data
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <span className={cn("hidden rounded-md px-2 py-1 text-[10px] font-black md:inline-flex", connected ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500")}>
            {connected ? "Live" : "Offline"}
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIndicatorMenuOpen((value) => !value);
                setCompareMenuOpen(false);
              }}
              className={cn("rounded-md px-2.5 py-2 text-[11px] font-black transition-colors", selectedIndicators.length > 0 ? "bg-blue-50 text-[#113285]" : "text-[#0A0F2C] hover:bg-slate-100")}
            >
              Indicators
            </button>
            {indicatorMenuOpen && (
              <div className="absolute right-0 top-10 z-[80] w-44 rounded-lg border border-slate-200 bg-white p-2 shadow-xl">
                {INDICATORS.map((indicator) => (
                  <button
                    key={indicator.id}
                    type="button"
                    onClick={() => toggleIndicator(indicator.id)}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs font-black text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: indicator.color }} />
                      {indicator.label}
                    </span>
                    {selectedIndicators.includes(indicator.id) && <span className="text-[#113285]">On</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setCompareMenuOpen((value) => !value);
                setIndicatorMenuOpen(false);
              }}
              className={cn("rounded-md px-2.5 py-2 text-[11px] font-black transition-colors", compareSymbol ? "bg-blue-50 text-[#113285]" : "text-[#0A0F2C] hover:bg-slate-100")}
            >
              Compare
            </button>
            {compareMenuOpen && (
              <div className="absolute right-0 top-10 z-[80] w-44 rounded-lg border border-slate-200 bg-white p-2 shadow-xl">
                <button
                  type="button"
                  onClick={() => {
                    setCompareSymbol(null);
                    setCompareMenuOpen(false);
                  }}
                  className="mb-1 flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs font-black text-slate-700 transition-colors hover:bg-slate-50"
                >
                  None
                  {!compareSymbol && <span className="h-1.5 w-1.5 rounded-full bg-[#113285]" />}
                </button>
                {COINS.filter((coinOption) => coinOption.symbol !== normalizedSymbol).map((coinOption) => (
                  <button
                    key={coinOption.symbol}
                    type="button"
                    onClick={() => {
                      setCompareSymbol(coinOption.symbol);
                      setCompareMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-xs font-black text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <CoinLogo src={coinOption.logoUrl} symbol={coinOption.baseAsset} className="h-5 w-5 p-0.5" />
                      <span className="truncate">{coinOption.pairLabel}</span>
                    </span>
                    {compareSymbol === coinOption.symbol && <span className="h-1.5 w-1.5 rounded-full bg-[#F5A400]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
          {!previewMode && (
            <button
              type="button"
              title="Open full chart page"
              aria-label="Open full chart page"
              onClick={onOpenPreview}
              className="grid h-8 w-8 place-items-center rounded-md text-[#0A0F2C] hover:bg-slate-100"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute left-[82px] right-[12px] top-[76px] z-10 flex min-w-0 items-center gap-x-1 overflow-hidden whitespace-nowrap text-[9px] font-black leading-4 text-[#0A0F2C] sm:text-[10px] 2xl:text-[11px]">
        <span className="shrink-0">{pairLabel}</span>
        <span className="shrink-0 text-slate-300">/</span>
        <span className="shrink-0">{interval}</span>
        <span className="shrink-0 text-slate-300">/</span>
        <span className="shrink-0">Binance</span>
        {selectedIndicators.length > 0 && (
          <span className="shrink truncate rounded bg-blue-50 px-1 py-0.5 text-[#113285]">
            {selectedIndicators.map((item) => INDICATORS.find((indicator) => indicator.id === item)?.label).join(", ")}
          </span>
        )}
        {compareSymbol && (
          <span className="shrink-0 rounded bg-amber-50 px-1 py-0.5 text-amber-700">
            Compare {getCoinBySymbol(compareSymbol)?.pairLabel ?? compareSymbol}
          </span>
        )}
        {headerCandle && (
          <>
            <span className="shrink-0 font-bold">O <b className="font-black text-[#0A0F2C]">{headerCandle.open.toFixed(2)}</b></span>
            <span className="shrink-0 font-bold">H <b className="font-black text-emerald-600">{headerCandle.high.toFixed(2)}</b></span>
            <span className="shrink-0 font-bold">L <b className="font-black text-red-500">{headerCandle.low.toFixed(2)}</b></span>
            <span className="shrink-0 font-bold">C <b className="font-black text-[#0A0F2C]">{headerCandle.close.toFixed(2)}</b></span>
          </>
        )}
      </div>

      <div className="pointer-events-none absolute left-[82px] top-[100px] z-10 text-[10px] font-black text-[#0A0F2C] sm:text-[11px]">
        Volume <span className="text-emerald-600">{headerCandle ? headerCandle.volume.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "--"}</span>
      </div>

      <div ref={hostRef} className="absolute inset-x-0 bottom-0 top-[58px] z-0 overflow-hidden pl-[54px]" />

      {(loading || error) && (
        <div className="absolute inset-x-[54px] bottom-0 top-[58px] z-20 grid place-items-center bg-white/70 backdrop-blur-[1px]">
          <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-center shadow-xl">
            {loading ? (
              <>
                <Loader2 className="mx-auto h-5 w-5 animate-spin text-[#113285]" />
                <p className="mt-2 text-sm font-black text-[#0A0F2C]">Loading Binance market data</p>
              </>
            ) : (
              <>
                <WifiOff className="mx-auto h-5 w-5 text-red-500" />
                <p className="mt-2 text-sm font-black text-[#0A0F2C]">{error}</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
