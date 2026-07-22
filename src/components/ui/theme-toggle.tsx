"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const modes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-10 w-[148px] rounded-md border border-banking-border bg-white" />;
  }

  return (
    <div className="inline-flex rounded-md border border-banking-border bg-white p-1">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const active = theme === mode.value;
        return (
          <button
            key={mode.value}
            type="button"
            onClick={() => setTheme(mode.value)}
            title={`${mode.label} mode`}
            className={`grid h-8 w-11 place-items-center rounded text-banking-muted transition ${
              active ? "bg-banking-blue text-white" : "hover:bg-blue-50"
            }`}
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}
