"use client";

import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { SUPPORTED_INTERVALS, SupportedInterval } from "@/config/coins";
import { cn } from "@/lib/utils";

export function TimeframeSelector({
  interval,
  menuOpen,
  onIntervalChange,
  onMenuToggle,
}: {
  interval: SupportedInterval;
  menuOpen: boolean;
  onIntervalChange: (interval: SupportedInterval) => void;
  onMenuToggle: () => void;
}) {
  return (
    <>
      {SUPPORTED_INTERVALS.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onIntervalChange(item)}
          className={cn(
            "shrink-0 rounded-md px-2.5 py-1.5 text-xs font-black transition-colors",
            interval === item ? "bg-blue-50 text-[#1677ff]" : "text-[#0A0F2C] hover:bg-slate-100",
          )}
        >
          {item}
        </button>
      ))}

      <div className="relative shrink-0">
        <button
          type="button"
          title="Interval filter"
          aria-label="Open interval filter"
          aria-expanded={menuOpen}
          onClick={onMenuToggle}
          className="flex h-8 items-center gap-1 rounded-md px-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#113285]"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", menuOpen && "rotate-180")} />
        </button>

        {menuOpen && (
          <div className="absolute left-0 top-10 z-50 w-32 rounded-lg border border-slate-200 bg-white p-1 shadow-xl">
            {SUPPORTED_INTERVALS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onIntervalChange(item)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs font-black transition-colors",
                  interval === item ? "bg-blue-50 text-[#113285]" : "text-slate-600 hover:bg-slate-50",
                )}
              >
                {item}
                {interval === item && <span className="h-1.5 w-1.5 rounded-full bg-[#113285]" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
