"use client";

import { Bell, Mail } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function NotificationsSettingsPage() {
  const [preferences, setPreferences] = useState({
    transactions: true,
    security: true,
    marketing: false,
    price: true,
  });

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-8">
          <h2 className="text-[18px] font-bold text-[#0A0F2C]">Notification Preferences</h2>
          <p className="mt-1 text-[14px] text-[#718096]">Choose what updates you want to receive</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div 
            className="flex items-center justify-between gap-4 cursor-pointer group"
            onClick={() => togglePreference("transactions")}
          >
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex shrink-0">
                <Mail className="h-5 w-5 text-[#0A0F2C]" strokeWidth={2} />
              </div>
              <div>
                <p className="text-[15px] font-bold text-[#0A0F2C]">Transaction Notifications</p>
                <p className="text-[14px] text-[#718096] mt-0.5">Receive alerts for deposits and withdrawals</p>
              </div>
            </div>
            {/* Adding a functional toggle that fits modern UX, even if not explicitly shown in static mockup */}
            <div className={cn(
              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#113285] focus:ring-offset-2",
              preferences.transactions ? "bg-[#113285]" : "bg-gray-200"
            )}>
              <span className={cn(
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                preferences.transactions ? "translate-x-5" : "translate-x-0"
              )} />
            </div>
          </div>

          <div 
            className="flex items-center justify-between gap-4 cursor-pointer group"
            onClick={() => togglePreference("security")}
          >
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex shrink-0">
                <Bell className="h-5 w-5 text-[#0A0F2C]" strokeWidth={2} />
              </div>
              <div>
                <p className="text-[15px] font-bold text-[#0A0F2C]">Security Alerts</p>
                <p className="text-[14px] text-[#718096] mt-0.5">Important security and login notifications</p>
              </div>
            </div>
            <div className={cn(
              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#113285] focus:ring-offset-2",
              preferences.security ? "bg-[#113285]" : "bg-gray-200"
            )}>
              <span className={cn(
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                preferences.security ? "translate-x-5" : "translate-x-0"
              )} />
            </div>
          </div>

          <div 
            className="flex items-center justify-between gap-4 cursor-pointer group"
            onClick={() => togglePreference("marketing")}
          >
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex shrink-0">
                <Mail className="h-5 w-5 text-[#0A0F2C]" strokeWidth={2} />
              </div>
              <div>
                <p className="text-[15px] font-bold text-[#0A0F2C]">Marketing Emails</p>
                <p className="text-[14px] text-[#718096] mt-0.5">Updates and promotional offers</p>
              </div>
            </div>
            <div className={cn(
              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#113285] focus:ring-offset-2",
              preferences.marketing ? "bg-[#113285]" : "bg-gray-200"
            )}>
              <span className={cn(
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                preferences.marketing ? "translate-x-5" : "translate-x-0"
              )} />
            </div>
          </div>

          <div 
            className="flex items-center justify-between gap-4 cursor-pointer group"
            onClick={() => togglePreference("price")}
          >
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex shrink-0">
                <Bell className="h-5 w-5 text-[#0A0F2C]" strokeWidth={2} />
              </div>
              <div>
                <p className="text-[15px] font-bold text-[#0A0F2C]">Price Alerts</p>
                <p className="text-[14px] text-[#718096] mt-0.5">Cryptocurrency price movements</p>
              </div>
            </div>
            <div className={cn(
              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#113285] focus:ring-offset-2",
              preferences.price ? "bg-[#113285]" : "bg-gray-200"
            )}>
              <span className={cn(
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                preferences.price ? "translate-x-5" : "translate-x-0"
              )} />
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button 
              type="submit"
              className="rounded-xl bg-[#113285] px-6 py-3 text-[14px] font-bold text-white shadow-sm transition-colors hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-[#113285] focus:ring-offset-2"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
