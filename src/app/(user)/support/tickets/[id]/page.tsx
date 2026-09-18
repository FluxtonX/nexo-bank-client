"use client";

import Link from "next/link";
import { MessageSquare, Paperclip, UserRoundCheck, Loader2, Send, X } from "lucide-react";
import { PageTitle, Panel } from "@/components/dashboard/blocks";
import { StatusBadge } from "@/components/ui/status-badge";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import {
  isSameDay,
  formatChatDayDivider,
  parseMessageContent,
  formatMessageContent,
} from "@/lib/chat-utils";

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [thread, setThread] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [replyText, setReplyText] = useState("");
  const { notify } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [ticketId, setTicketId] = useState<string>("");

  // Attachment & Lightbox state
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notify({
        title: "Invalid file type",
        description: "Please select an image file (PNG, JPG, WEBP, GIF).",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setAttachmentFile(file);
    const objectUrl = URL.createObjectURL(file);
    setAttachmentPreview(objectUrl);
  };

  const handleRemoveAttachment = () => {
    if (attachmentPreview) {
      URL.revokeObjectURL(attachmentPreview);
    }
    setAttachmentFile(null);
    setAttachmentPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    async function loadTicket() {
      const resolvedParams = await params;
      setTicketId(resolvedParams.id);
      
      try {
        const response = await fetch(`/api/support/tickets/${resolvedParams.id}`);
        const data = await response.json();
        
        if (data.thread) {
          setThread(data.thread);
        }
        if (data.messages) {
          setMessages(data.messages);
        }
      } catch (error) {
        console.error("Error loading ticket:", error);
        notify({
          title: "Error",
          description: "Failed to load support ticket",
        });
      } finally {
        setLoading(false);
      }
    }
    loadTicket();
  }, [params, notify]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendReply = async () => {
    if ((!replyText.trim() && !attachmentFile) || sending || !ticketId) return;
    
    const currentAttachment = attachmentFile;
    const textToSend = replyText.trim();
    setSending(true);
    handleRemoveAttachment();
    setReplyText("");

    try {
      let uploadedUrl: string | null = null;
      if (currentAttachment) {
        const formData = new FormData();
        formData.append("file", currentAttachment);
        const uploadRes = await fetch("/api/support/upload", {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok) {
          const errData = await uploadRes.json();
          throw new Error(errData.error || "Failed to upload image");
        }
        const uploadData = await uploadRes.json();
        uploadedUrl = uploadData.url;
      }

      const finalPayload = formatMessageContent(textToSend, uploadedUrl);

      const response = await fetch(`/api/support/tickets/${ticketId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: finalPayload }),
      });
      
      const data = await response.json();
      
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
        notify({
          title: "Success",
          description: "Message sent successfully",
        });
      }
    } catch (error: any) {
      console.error("Error sending reply:", error);
      notify({
        title: "Error",
        description: error.message || "Failed to send message",
      });
    } finally {
      setSending(false);
    }
  };



  if (loading) {

    return (

      <div className="flex min-h-[400px] items-center justify-center">

        <Loader2 className="h-8 w-8 animate-spin text-banking-blue" />

      </div>

    );

  }



  if (!thread) {

    return (

      <div className="text-center py-12">

        <p className="text-banking-muted">Ticket not found</p>

        <Link href="/support/tickets" className="inline-block mt-4 text-banking-blue font-semibold">

          Back to tickets

        </Link>

      </div>

    );

  }



  return (

    <>

      <PageTitle

        title={`Support Ticket ${thread.id}`}

        description="Ticket detail, message history, attachments, status, and next actions."

        action={

          <Link href="/support" className="rounded-md bg-banking-blue px-4 py-2 text-sm font-semibold text-white">

            Open chat

          </Link>

        }

      />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.7fr]">

        <Panel title="Conversation">
          <div className="space-y-4 max-h-[500px] overflow-y-auto mb-4">
            {messages.length === 0 ? (
              <p className="text-sm text-banking-muted text-center py-8">No messages yet</p>
            ) : (
              messages.map((msg, index) => {
                const currentCreatedAt = msg.created_at || new Date().toISOString();
                const prevMsg = index > 0 ? messages[index - 1] : null;
                const prevCreatedAt = prevMsg ? prevMsg.created_at : null;
                const isNewDay = !prevCreatedAt || !isSameDay(currentCreatedAt, prevCreatedAt);
                const { text: cleanText, imageUrl } = parseMessageContent(msg.text);

                return (
                  <div key={msg.id} className="space-y-3">
                    {/* Day Divider */}
                    {isNewDay && (
                      <div className="flex items-center justify-center my-3 select-none">
                        <div className="h-[1px] flex-1 bg-banking-border" />
                        <span className="mx-3 px-3 py-1 rounded-full text-[10.5px] font-bold text-banking-muted bg-white border border-banking-border shadow-2xs">
                          {formatChatDayDivider(currentCreatedAt)}
                        </span>
                        <div className="h-[1px] flex-1 bg-banking-border" />
                      </div>
                    )}

                    <div className={msg.sender === "Client" ? "flex justify-end" : "flex justify-start"}>
                      <div className={msg.sender === "Client" ? "max-w-[78%] rounded-lg bg-banking-blue p-3 text-sm text-white shadow-xs" : "max-w-[78%] rounded-lg bg-banking-offWhite p-3 text-sm text-slate-800 shadow-xs border border-banking-border"}>
                        {imageUrl && (
                          <div className="mb-2 overflow-hidden rounded-md border border-black/10 bg-black/5">
                            <img
                              src={imageUrl}
                              alt="attachment"
                              className="max-h-60 max-w-full rounded-md object-contain cursor-pointer hover:opacity-90 transition-opacity bg-white/40"
                              onClick={() => setPreviewModalUrl(imageUrl)}
                              loading="lazy"
                            />
                          </div>
                        )}
                        {cleanText && <p className="break-words whitespace-pre-wrap">{cleanText}</p>}
                        <p className="text-[10px] mt-1 opacity-70 text-right">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Attachment Preview Banner */}
          {attachmentPreview && (
            <div className="px-3 pt-2 pb-1 bg-slate-50 border border-banking-border rounded-md mb-2 flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded border border-banking-border overflow-hidden bg-white shrink-0">
                  <img src={attachmentPreview} alt="Preview" className="h-full w-full object-cover" />
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-slate-800 truncate max-w-[200px]">
                    {attachmentFile?.name}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    {attachmentFile ? `${(attachmentFile.size / 1024).toFixed(1)} KB` : ""} • Image attached
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveAttachment}
                className="h-6 w-6 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                title="Remove attachment"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <div className="flex gap-2 border-t border-banking-border pt-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
              className="hidden"
              onChange={handleFileSelect}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "rounded-md border border-banking-border p-2 text-banking-muted hover:bg-slate-100 transition-colors cursor-pointer",
                attachmentFile && "border-banking-blue bg-blue-50 text-banking-blue"
              )}
              title="Attach image"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendReply();
                }
              }}
              className="flex-1 rounded-md border border-banking-border px-3 py-2 text-sm outline-none focus:border-banking-blue"
              placeholder={attachmentFile ? "Add a caption with image (optional)..." : "Type your reply..."}
              disabled={sending}
            />
            <button
              onClick={handleSendReply}
              disabled={(!replyText.trim() && !attachmentFile) || sending}
              className="rounded-md bg-banking-blue px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 cursor-pointer"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
        </Panel>

        <Panel title="Ticket details">
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-banking-muted">Status</span>
              <StatusBadge status={thread.status?.toLowerCase() || "open"} />
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-banking-muted">Category</span>
              <span className="font-semibold">{thread.category?.replaceAll("_", " ") || "general"}</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-banking-muted">Subject</span>
              <span className="font-semibold text-right">{thread.subject || "Support Request"}</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-banking-muted">Created</span>
              <span className="font-semibold">{new Date(thread.created_at).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-banking-muted">Last updated</span>
              <span className="font-semibold">{new Date(thread.updated_at).toLocaleDateString()}</span>
            </div>

            {/* Sidebar Attachments List */}
            {(() => {
              const allAttachments = messages
                .map((m) => parseMessageContent(m.text).imageUrl)
                .filter(Boolean) as string[];

              return (
                <div className="rounded-md border border-banking-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-banking-blue">
                      <Paperclip className="h-4 w-4" />
                      <span>Attachments ({allAttachments.length})</span>
                    </div>
                  </div>
                  {allAttachments.length === 0 ? (
                    <p className="text-xs text-banking-muted">No attachments uploaded</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {allAttachments.map((url, i) => (
                        <div
                          key={i}
                          className="h-16 rounded border border-banking-border overflow-hidden bg-slate-50 cursor-pointer hover:opacity-85 transition-opacity"
                          onClick={() => setPreviewModalUrl(url)}
                        >
                          <img src={url} alt={`Attachment ${i + 1}`} className="h-full w-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            <Link href="/support/tickets" className="inline-flex items-center gap-2 text-sm font-semibold text-banking-blue">
              <MessageSquare className="h-4 w-4" />
              Back to tickets
            </Link>
          </div>
        </Panel>
      </div>

      {/* Lightbox Modal */}
      {previewModalUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setPreviewModalUrl(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewModalUrl(null)}
              className="absolute -top-10 right-0 text-white hover:text-slate-300 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              title="Close preview"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={previewModalUrl}
              alt="Enlarged attachment"
              className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/15"
            />
            <div className="mt-3.5 flex items-center gap-3">
              <a
                href={previewModalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-sm transition-colors flex items-center gap-1.5"
              >
                Open original in new tab ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </>

  );

}

