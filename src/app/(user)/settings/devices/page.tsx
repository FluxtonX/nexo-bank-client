"use client";

import { Smartphone, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface UserSession {
  id: string;
  device_name: string;
  os: string;
  browser: string;
  location: string;
  last_active: string;
}

export default function DevicesSettingsPage() {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Determine current session from localStorage
    const localSessionId = localStorage.getItem('current_session_id');
    if (localSessionId) {
      setCurrentSessionId(localSessionId);
    }

    const fetchSessions = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('last_active', { ascending: false });

      if (data) {
        setSessions(data);
      }
      setIsLoading(false);
    };

    fetchSessions();
  }, [supabase]);

  const handleRevoke = async (id: string) => {
    // Optimistic UI update
    setSessions((prev) => prev.filter((s) => s.id !== id));
    
    // Call backend
    await supabase.from('user_sessions').delete().eq('id', id);

    // Show toast
    // Assuming you have a toast component or simple alert since there's no generic toast imported
    alert("Device removed");
  };

  const isOnlyDevice = sessions.length <= 1;

  const getDeviceIcon = (os: string) => {
    if (os.includes("iOS") || os.includes("Android")) {
      return <Smartphone className="h-6 w-6 text-[#113285]" strokeWidth={2} />;
    }
    return <Monitor className="h-6 w-6 text-[#113285]" strokeWidth={2} />;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    
    if (diffHours < 1) return "Active now";
    if (diffHours < 24) return `${Math.floor(diffHours)} hours ago`;
    return `${Math.floor(diffHours / 24)} days ago`;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Trusted Devices Card */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-[18px] font-bold text-[#0A0F2C]">Trusted Devices</h2>
          <p className="mt-1 text-[14px] text-[#718096]">Manage devices that can access your account</p>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-4">
              <span className="w-6 h-6 border-2 border-[#113285]/30 border-t-[#113285] rounded-full animate-spin"></span>
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-[14px] text-gray-500 text-center py-4">No trusted devices found.</p>
          ) : (
            sessions.map((session) => {
              const isCurrent = session.id === currentSessionId;
              
              return (
                <div key={session.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F4F8FF]">
                      {getDeviceIcon(session.os)}
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-[#0A0F2C]">{session.device_name}</p>
                      <p className="text-[14px] text-[#718096] mt-0.5">
                        {session.location} • {formatTime(session.last_active)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                    {isCurrent && (
                      <span className="inline-flex shrink-0 items-center rounded-full bg-[#C6F6D5] px-3 py-1 text-[12px] font-bold text-[#22543D]">
                        Trusted
                      </span>
                    )}
                    <button 
                      onClick={() => handleRevoke(session.id)}
                      disabled={isOnlyDevice || isCurrent}
                      className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-[13px] font-bold text-[#0A0F2C] shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#113285] focus:ring-offset-2 ml-auto sm:ml-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
