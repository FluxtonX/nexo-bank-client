"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const STORAGE_KEY = "banner_dismissed";

const COLOR_MAP: Record<string, string> = {
  blue:   "#1650AB",
  amber:  "#D97706",
  green:  "#059669",
  red:    "#DC2626",
  purple: "#7C3AED",
  dark:   "#111827",
};

interface BannerData {
  enabled: boolean;
  text: string;
  url: string;
  color: string;
}

export function AnnouncementBanner() {
  const [banner, setBanner] = useState<BannerData | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed this session
    if (typeof window !== "undefined") {
      const wasDismissed = sessionStorage.getItem(STORAGE_KEY) === "true";
      if (wasDismissed) {
        setDismissed(true);
        return;
      }
    }

    const supabase = createClient();

    async function loadBanner() {
      try {
        const { data, error } = await supabase
          .from("site_content")
          .select("key, value")
          .eq("category", "global")
          .in("key", [
            "global.banner.enabled",
            "global.banner.text",
            "global.banner.url",
            "global.banner.color",
          ]);

        if (error || !data) return;

        const map: Record<string, any> = {};
        data.forEach((row) => (map[row.key] = row.value));

        const enabled =
          map["global.banner.enabled"] === true ||
          map["global.banner.enabled"] === "true";

        if (!enabled) return;

        setBanner({
          enabled: true,
          text:  (map["global.banner.text"]  as string) ?? "",
          url:   (map["global.banner.url"]   as string) ?? "",
          color: (map["global.banner.color"] as string) ?? "blue",
        });
      } catch (err) {
        console.error("[AnnouncementBanner] Failed to load banner:", err);
      }
    }

    loadBanner();
  }, []);

  function handleDismiss() {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, "true");
    }
    setDismissed(true);
  }

  if (!banner || !banner.enabled || dismissed) return null;

  const bg = COLOR_MAP[banner.color] ?? COLOR_MAP.blue;

  const inner = (
    <span className="flex-1 text-center text-[13px] font-semibold leading-snug">
      {banner.text}
    </span>
  );

  return (
    <div
      role="banner"
      style={{ backgroundColor: bg }}
      className="relative flex items-center justify-center gap-3 px-10 py-2.5 text-white"
    >
      {banner.url ? (
        <a
          href={banner.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center text-[13px] font-semibold leading-snug hover:underline underline-offset-2"
        >
          {banner.text}
        </a>
      ) : (
        inner
      )}

      <button
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 opacity-80 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-white/50"
      >
        <X className="h-4 w-4" strokeWidth={2.5} />
      </button>
    </div>
  );
}
