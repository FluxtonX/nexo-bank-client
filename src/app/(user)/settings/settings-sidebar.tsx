"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Lock, Smartphone, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarNav = [
  { label: "Profile", href: "/settings", icon: User },
  { label: "Security", href: "/settings/security", icon: Lock },
  { label: "Devices", href: "/settings/devices", icon: Smartphone },
  { label: "Notifications", href: "/settings/notifications", icon: Bell },
];

export function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col space-y-1">
      {sidebarNav.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-4 rounded-xl px-4 py-3 text-[15px] font-medium transition-colors",
              active 
                ? "bg-[#113285] text-white shadow-md shadow-blue-900/10" 
                : "text-[#0A0F2C] hover:bg-gray-50"
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
