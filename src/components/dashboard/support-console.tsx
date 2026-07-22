"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MessageSquare, Paperclip, Send, UserRoundCheck, Loader2, Check, CheckCheck, Clock, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type MessageStatus = "sending" | "sent" | "delivered" | "seen";

type Message = {
  id: string;
  from: "user" | "agent";
  text: string;
  time: string;
  status: MessageStatus;
};

export function SupportConsole() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [thread, setThread] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [convertCategory, setConvertCategory] = useState("KYC");
  const [converting, setConverting] = useState(false);
  const { notify } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use useRef for supabase client to ensure stable reference across renders
  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;

  // Track if component is mounted to prevent state updates after unmount
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // ─── Load User + Thread + Messages ────────────────────────────────────────
  useEffect(() => {
    async function initChat() {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          setLoading(false);
          return;
        }
        setUser(authUser);

        // Fetch the latest active or waiting thread for this user
        const { data: threadData, error: threadErr } = await supabase
          .from("support_threads")
          .select("*")
          .eq("user_id", authUser.id)
          .in("status", ["Active", "Waiting"])
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (threadErr) {
          console.error("Error fetching thread:", threadErr);
        }

        if (threadData) {
          setThread(threadData);

          // Fetch all messages for this thread
          const { data: msgs, error: msgsErr } = await supabase
            .from("support_messages")
            .select("*")
            .eq("thread_id", threadData.id)
            .order("created_at", { ascending: true });

          if (msgsErr) {
            console.error("Error fetching messages:", msgsErr);
          }

          if (msgs && msgs.length > 0) {
            const formattedMsgs: Message[] = msgs.map((m: any) => ({
              id: m.id,
              from: m.sender === "Client" ? "user" as const : "agent" as const,
              text: m.text,
              time: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              status: m.sender === "Client"
                ? (threadData.unread_count_admin === 0 ? "seen" : "delivered") as MessageStatus
                : "seen" as MessageStatus,
            }));
            setMessages(formattedMsgs);
          }

          // Reset client's own unread count (we've just opened the chat)
          if (threadData.unread_count_user > 0) {
            await supabase
              .from("support_threads")
              .update({ unread_count_user: 0 })
              .eq("id", threadData.id);
          }
        }
      } catch (err) {
        console.error("Error loading support chat:", err);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    }
    initChat();
  }, []);

  // ─── Realtime Subscriptions ───────────────────────────────────────────────
  useEffect(() => {
    if (!thread?.id) return;

    // Listen for NEW messages in this thread
    const messagesChannel = supabase
      .channel(`support_messages_client:${thread.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "support_messages",
          filter: `thread_id=eq.${thread.id}`,
        },
        async (payload) => {
          if (!mountedRef.current) return;
          const newMsg = payload.new as any;

          const formattedMsg: Message = {
            id: newMsg.id,
            from: newMsg.sender === "Client" ? "user" : "agent",
            text: newMsg.text,
            time: new Date(newMsg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            status: newMsg.sender === "Client" ? "delivered" : "seen",
          };

          setMessages((current) => {
            // Check if we already have this message (from optimistic add or previous realtime)
            const existingIndex = current.findIndex((m) => m.id === newMsg.id);
            if (existingIndex !== -1) {
              // Update the existing message status (e.g. from "sending" to "delivered")
              const updated = [...current];
              updated[existingIndex] = {
                ...updated[existingIndex],
                status: formattedMsg.status,
              };
              return updated;
            }

            // Also check for temp-id messages that match this text (optimistic adds)
            const tempIndex = current.findIndex(
              (m) => m.id.startsWith("temp-") && m.text === newMsg.text && m.from === "user"
            );
            if (tempIndex !== -1) {
              // Replace the temp message with the real one
              const updated = [...current];
              updated[tempIndex] = formattedMsg;
              return updated;
            }

            return [...current, formattedMsg];
          });

          // If message is from admin, clear our unread count and show notification
          if (newMsg.sender === "Admin") {
            await supabase
              .from("support_threads")
              .update({ unread_count_user: 0 })
              .eq("id", thread.id);

            if (document.hidden) {
              notify({
                title: "Support Reply",
                description: newMsg.text,
              });
            }
          }
        }
      )
      .subscribe();

    // Listen for thread updates (status changes, unread count changes)
    const threadChannel = supabase
      .channel(`support_threads_client:${thread.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "support_threads",
          filter: `id=eq.${thread.id}`,
        },
        (payload) => {
          if (!mountedRef.current) return;
          const updatedThread = payload.new as any;
          setThread(updatedThread);

          // Update message statuses when admin reads messages (unread_count_admin goes to 0)
          if (updatedThread.unread_count_admin === 0) {
            setMessages((current) =>
              current.map((m) =>
                m.from === "user" && m.status !== "seen"
                  ? { ...m, status: "seen" as MessageStatus }
                  : m
              )
            );
          }

          // Notify if ticket was just resolved or closed
          if (payload.old) {
            const oldStatus = (payload.old as any).status;
            if (oldStatus !== "Resolved" && updatedThread.status === "Resolved") {
              notify({
                title: "Ticket Resolved",
                description: "This support conversation has been marked as resolved.",
              });
            } else if (oldStatus !== "Closed" && updatedThread.status === "Closed") {
              notify({
                title: "Ticket Closed",
                description: "This support conversation has been closed by an administrator.",
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(threadChannel);
    };
  }, [thread?.id]);

  // ─── Auto-scroll to bottom ───────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ─── Send Message ────────────────────────────────────────────────────────
  const sendMessage = useCallback(async () => {
    if (!draft.trim() || !user || sending) return;
    const messageText = draft.trim();
    setDraft("");
    setSending(true);

    // Generate a temporary ID for optimistic rendering
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const tempMsg: Message = {
      id: tempId,
      from: "user",
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sending",
    };

    // Optimistically add the message to the UI IMMEDIATELY
    setMessages((current) => [...current, tempMsg]);

    try {
      let currentThreadId = thread?.id;

      // Create thread if this is the first message
      if (!currentThreadId) {
        const { data: newThread, error: threadErr } = await supabase
          .from("support_threads")
          .insert({ user_id: user.id, status: "Waiting" })
          .select()
          .single();

        if (threadErr) throw threadErr;
        if (!newThread) throw new Error("Failed to create support thread");

        setThread(newThread);
        currentThreadId = newThread.id;
      }

      // Insert the message
      const { data: newMsg, error: msgErr } = await supabase
        .from("support_messages")
        .insert({
          thread_id: currentThreadId,
          sender: "Client",
          text: messageText,
        })
        .select()
        .single();

      if (msgErr) throw msgErr;

      if (newMsg) {
        // Replace the temp message with the real one from DB
        setMessages((current) =>
          current.map((m) =>
            m.id === tempId
              ? {
                  id: newMsg.id,
                  from: "user" as const,
                  text: newMsg.text,
                  time: new Date(newMsg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  status: "sent" as MessageStatus,
                }
              : m
          )
        );
      } else {
        // If select didn't return data (rare), update temp to "sent" status
        setMessages((current) =>
          current.map((m) =>
            m.id === tempId ? { ...m, status: "sent" as MessageStatus } : m
          )
        );
      }
    } catch (err) {
      console.error("Failed to send support message:", err);
      // Mark the temp message as failed but keep it visible
      setMessages((current) =>
        current.map((m) =>
          m.id === tempId ? { ...m, status: "sending" as MessageStatus } : m
        )
      );
      notify({
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    } finally {
      setSending(false);
    }
  }, [draft, user, thread, sending, notify]);

  // ─── Message Status Icon (WhatsApp style) ─────────────────────────────────
  const MessageStatusIcon = useCallback(({ status }: { status: MessageStatus }) => {
    switch (status) {
      case "sending":
        return <Clock className="h-3 w-3 shrink-0 text-white/40 animate-pulse" />;
      case "sent":
        return <Check className="h-3.5 w-3.5 shrink-0 text-white/50" />;
      case "delivered":
        return <CheckCheck className="h-3.5 w-3.5 shrink-0 text-white/50" />;
      case "seen":
        return <CheckCheck className="h-3.5 w-3.5 shrink-0 text-sky-300" />;
      default:
        return null;
    }
  }, []);

  // ─── Loading State ────────────────────────────────────────────────────────
// ─── Loading State ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-banking-border bg-white shadow-sm">
        <Loader2 className="h-8 w-8 animate-spin text-banking-blue" />
      </div>
    );
  }

  // ─── Convert to Ticket ──────────────────────────────────────────────────
  async function handleConvertToTicket() {
    if (!thread) return;
    setConverting(true);
    try {
      const ticket_id = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
      
      const { error } = await supabase
        .from("support_threads")
        .update({
          is_ticket: true,
          category: convertCategory,
          ticket_id
        })
        .eq("id", thread.id);
        
      if (error) throw error;
      
      notify({
        title: "Ticket created",
        description: `Your conversation has been converted to ticket ${ticket_id}`,
        type: "success"
      });
      
      setThread((prev: any) => ({ ...prev, is_ticket: true, category: convertCategory, ticket_id }));
      setShowConvertModal(false);
    } catch (err) {
      console.error(err);
      notify({
        title: "Error",
        description: "Failed to convert to ticket.",
        type: "error"
      });
    } finally {
      setConverting(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col rounded-xl border border-banking-border bg-banking-card shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-banking-border p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-emerald-50 text-emerald-700">
            <UserRoundCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold">Support desk</h2>
            <p className="text-sm text-banking-muted">Average response: under 5 minutes</p>
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
          thread?.status === "Resolved" ? "bg-gray-150 text-gray-700" :
          thread?.status === "Waiting" ? "bg-amber-50 text-amber-700" :
          "bg-emerald-50 text-emerald-700"
        }`}>
          {thread?.status || "Online"}
        </span>
      </div>

      {/* Messages Area */}
      <div className="max-h-[420px] min-h-[300px] space-y-4 overflow-y-auto bg-banking-offWhite p-4">
        {messages.length === 0 && (
          <div className="text-center py-12 text-sm text-banking-muted">
            No messages yet. Send a message to start chatting with support!
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={message.from === "user" ? "flex justify-end" : "flex justify-start"}
          >
            <div
              className={
                message.from === "user"
                  ? "max-w-[70%] rounded-2xl rounded-br-none bg-banking-blue px-3.5 py-2 text-xs font-semibold leading-relaxed text-white shadow-sm"
                  : "max-w-[70%] rounded-2xl rounded-bl-none border border-slate-200 bg-slate-100 px-3.5 py-2 text-xs font-semibold leading-relaxed text-slate-900 shadow-sm"
              }
              style={message.from === "user" ? { background: "linear-gradient(135deg, #0A3D91 0%, #1650AB 100%)" } : {}}
            >
              <p className="break-words">{message.text}</p>
              <div className="mt-1.5 flex items-center justify-end gap-1.5">
                <span className={message.from === "user" ? "text-[9px] text-white/70 font-semibold" : "text-[9px] text-slate-500 font-semibold"}>
                  {message.time}
                </span>
                {message.from === "user" && (
                  <MessageStatusIcon status={message.status} />
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Compose Area or Closed Status */}
      {thread?.status === "Resolved" || thread?.status === "Closed" ? (
        <div className="flex flex-col items-center justify-center p-6 border-t border-banking-border bg-white text-center">
          <p className="text-sm font-semibold text-banking-muted mb-3">
            This conversation has been {thread.status.toLowerCase()}.
          </p>
          <button 
            onClick={() => { setThread(null); setMessages([]); }}
            className="rounded-md bg-banking-blue px-5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90"
          >
            Start New Conversation
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 border-t border-banking-border p-3">
            <button className="grid h-10 w-10 place-items-center rounded-md text-banking-muted hover:bg-banking-offWhite">
              <Paperclip className="h-5 w-5" />
            </button>
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              className="h-10 flex-1 rounded-md border border-transparent px-3 outline-none focus:border-banking-border text-sm"
              placeholder="Write a message"
              disabled={sending}
            />
            <button
              onClick={sendMessage}
              disabled={!draft.trim() || sending}
              className="grid h-10 w-10 place-items-center rounded-md bg-banking-blue text-white disabled:opacity-50"
            >
              {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </button>
          </div>
          {!thread?.is_ticket ? (
            <button 
              onClick={() => setShowConvertModal(true)}
              className="flex items-center gap-2 border-t border-banking-border bg-white px-4 py-3 text-sm text-banking-blue font-medium hover:bg-banking-offWhite transition-colors text-left"
            >
              <MessageSquare className="h-4 w-4" />
              This chat can be converted into a support ticket.
            </button>
          ) : (
            <div className="flex items-center gap-2 border-t border-banking-border bg-banking-offWhite px-4 py-3 text-sm text-banking-muted font-medium">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Converted to Ticket ({thread.ticket_id})
            </div>
          )}
        </>
      )}

      {/* Convert to Ticket Modal */}
      {showConvertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg">Convert to Ticket</h3>
              <p className="text-xs text-gray-500 mt-1">Select a category for your ticket.</p>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Category</label>
                <select 
                  value={convertCategory} 
                  onChange={(e) => setConvertCategory(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-banking-blue"
                >
                  <option value="KYC">KYC</option>
                  <option value="Withdrawal">Withdrawal</option>
                  <option value="Deposit">Deposit</option>
                  <option value="Account">Account</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50">
              <button 
                onClick={() => setShowConvertModal(false)}
                className="flex-1 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={handleConvertToTicket}
                disabled={converting}
                className="flex-1 py-2 text-sm font-semibold text-white bg-banking-blue rounded-lg disabled:opacity-50"
              >
                {converting ? "Converting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
