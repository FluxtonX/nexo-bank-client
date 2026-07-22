import { ReactNode } from "react";
import { SettingsSidebar } from "./settings-sidebar";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1000px] pb-12">
      <div className="mb-6 md:mb-8">
        <h1 className="text-[28px] font-bold text-[#0A0F2C]">Settings</h1>
        <p className="text-[15px] text-[#718096] mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:gap-8 items-start">
        <aside className="w-full md:w-[260px] shrink-0 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm md:sticky md:top-[112px] md:self-start z-10">
          <SettingsSidebar />
        </aside>
        
        <div className="w-full min-w-0 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
