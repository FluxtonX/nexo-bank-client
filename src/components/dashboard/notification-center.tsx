"use client";

import { useMemo, useState, useEffect } from "react";
import { Search, Settings, Info, AlertTriangle, ShieldCheck, XCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const filters = ["all", "security", "kyc", "wallet"];

export function NotificationCenter() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [dbNotifications, setDbNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [kycStatus, setKycStatus] = useState<string | null>(null);
  const [isHighValue, setIsHighValue] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: kyc } = await supabase
          .from("kyc_submissions")
          .select("status")
          .eq("user_id", user.id)
          .single();
        
        setKycStatus(kyc?.status ?? null);

        const { count } = await supabase
          .from("deposit_requests")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("status", "approved");

        setIsHighValue((count || 0) > 0);
      } catch (e) {
        console.error("Error loading user context for notifications:", e);
      } finally {
        setUserLoading(false);
      }
    }

    async function fetchNotifications() {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setDbNotifications([]);
          return;
        }

        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (!error && data) {
          setDbNotifications(data);
        }
      } catch (e) {
        console.error("Error loading notifications:", e);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
    fetchNotifications();

    const channel = supabase
      .channel("realtime-announcements")
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, () => {
        fetchNotifications();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("deleted_notifications");
    if (saved) {
      try {
        setDeletedIds(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleDelete = async (id: string) => {
    const newDeleted = [...deletedIds, id];
    setDeletedIds(newDeleted);
    localStorage.setItem("deleted_notifications", JSON.stringify(newDeleted));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from("notifications")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
    } catch (e) {
      console.error("Error deleting notification:", e);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id)
        .eq("user_id", user.id);

      // Update local state
      setDbNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
    } catch (e) {
      console.error("Error marking notification as read:", e);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

      // Update local state
      setDbNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true }))
      );
    } catch (e) {
      console.error("Error marking all notifications as read:", e);
    }
  };

  const visibleNotifications = useMemo(() => {
    return dbNotifications;
  }, [dbNotifications]);

  const mergedNotifications = useMemo(() => {
    const iconMap: Record<string, any> = {
      Info: Info,
      Warning: AlertTriangle,
      Success: ShieldCheck,
      Error: XCircle,
    };

    return visibleNotifications.map((n: any) => {
      const diffMs = Date.now() - new Date(n.created_at).getTime();
      const diffMin = Math.floor(diffMs / 1000 / 60);
      const diffHr = Math.floor(diffMin / 60);
      const diffDays = Math.floor(diffHr / 24);

      let timeStr = "just now";
      if (diffDays > 0) timeStr = `${diffDays}d ago`;
      else if (diffHr > 0) timeStr = `${diffHr}h ago`;
      else if (diffMin > 0) timeStr = `${diffMin}m ago`;

      return {
        id: n.id,
        title: n.title,
        body: n.message,
        time: timeStr,
        icon: iconMap[n.type] || Info,
        is_read: n.is_read,
      };
    });
  }, [visibleNotifications]);

  const rows = useMemo(() => {
    return mergedNotifications.filter((item) => {
      if (deletedIds.includes(item.id)) return false;
      const text = `${item.title} ${item.body}`.toLowerCase();
      const category =
        item.title.toLowerCase().includes("kyc")
          ? "kyc"
          : item.title.toLowerCase().includes("deposit")
            ? "wallet"
            : "security";
      return (
        text.includes(query.toLowerCase()) &&
        (filter === "all" || category === filter)
      );
    });
  }, [mergedNotifications, query, filter, deletedIds]);

  const unreadCount = mergedNotifications.filter(n => !n.is_read && !deletedIds.includes(n.id)).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto] flex-1">
          <label className="flex h-11 items-center gap-2 rounded-md border border-banking-border px-3 text-sm text-banking-muted">
            <Search className="h-4 w-4" />
            <input
              suppressHydrationWarning
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-full flex-1 bg-transparent outline-none"
              placeholder="Search notifications"
            />
          </label>
          <select
            suppressHydrationWarning
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="h-11 rounded-md border border-banking-border bg-white px-3 text-sm cursor-pointer outline-none"
          >
            {filters.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <Link
            href="/notifications/preferences"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-banking-border bg-white px-4 text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            <Settings className="h-4 w-4" />
            Preferences
          </Link>
        </div>
        <button
          onClick={handleMarkAllAsRead}
          disabled={unreadCount === 0}
          className="ml-4 inline-flex h-11 items-center justify-center gap-2 rounded-md border border-banking-border bg-white px-4 text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Mark all as read
        </button>
      </div>
      <div className="space-y-3">
        {loading ? (
          <div className="py-12 text-center text-sm font-semibold text-banking-muted animate-pulse">
            Loading announcements...
          </div>
        ) : rows.length === 0 ? (
          <div className="py-12 text-center text-sm font-semibold text-banking-muted border border-dashed border-banking-border rounded-lg bg-banking-offWhite/30">
            No announcements found.
          </div>
        ) : (
          rows.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.id}
                onClick={() => !item.is_read && handleMarkAsRead(item.id)}
                className={`group flex gap-4 rounded-md border p-4 hover:border-gray-300 transition-colors relative cursor-pointer ${
                  !item.is_read ? "bg-blue-50/30 border-blue-200" : "bg-white border-banking-border"
                }`}
              >
                <div className={`grid h-11 w-11 place-items-center rounded-md shrink-0 ${
                  !item.is_read ? "bg-blue-100 text-banking-blue" : "bg-blue-50 text-banking-blue"
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1 pr-10">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                    <h2 className={`font-semibold ${!item.is_read ? "text-gray-900" : "text-gray-600"}`}>{item.title}</h2>
                    <span className="w-fit rounded-full bg-banking-offWhite px-2.5 py-1 text-xs font-semibold text-banking-muted">
                      {item.time}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-banking-muted">
                    {item.body}
                  </p>
                </div>
                {!item.is_read && (
                  <div className="absolute right-4 top-4">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span>
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                  title="Delete notification"
                  style={{ right: !item.is_read ? "2rem" : "1rem" }}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
