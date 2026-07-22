"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function CoinLogo({
  src,
  symbol,
  className,
  imageClassName,
}: {
  src?: string;
  symbol: string;
  className?: string;
  imageClassName?: string;
}) {
  const [failed, setFailed] = React.useState(false);

  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm",
        className,
      )}
    >
      {src && !failed ? (
        <img
          src={src}
          alt={`${symbol} logo`}
          className={cn("h-full w-full object-contain", imageClassName)}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="text-xs font-black text-[#113285]">{symbol.slice(0, 1)}</span>
      )}
    </span>
  );
}
