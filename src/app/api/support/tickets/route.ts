import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all support threads for this user
    const { data: threads, error } = await supabase
      .from("support_threads")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ tickets: threads || [] });
  } catch (error: any) {
    console.error("Error fetching support tickets:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { category, messageText, threadId: existingThreadId } = await request.json();

    if (!messageText || !messageText.trim()) {
      return NextResponse.json({ error: "Message text is required" }, { status: 400 });
    }

    // Use admin client to reliably create threads, messages, and admin/bot responses
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const adminSupabase = createAdminClient();

    // Ensure user profile exists to satisfy support_threads_user_id_fkey
    const fullName = user.user_metadata?.full_name?.trim() || user.email?.split("@")[0] || "Nexo Member";
    await adminSupabase.from("profiles").upsert(
      {
        id: user.id,
        email: user.email,
        full_name: fullName,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    let threadId = existingThreadId;
    let ticketId: string | null = null;
    let newThread: any = null;

    if (!threadId) {
      ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
      const { data: createdThread, error: threadErr } = await adminSupabase
        .from("support_threads")
        .insert({
          user_id: user.id,
          status: "Waiting",
          is_ticket: true,
          category: category || "General Inquiry",
          ticket_id: ticketId,
          unread_count_admin: 1,
          unread_count_user: 0,
        })
        .select()
        .single();

      if (threadErr) throw threadErr;
      newThread = createdThread;
      threadId = createdThread.id;
    } else {
      // Fetch existing thread to get or assign ticket_id
      const { data: currentThread } = await adminSupabase
        .from("support_threads")
        .select("*")
        .eq("id", threadId)
        .single();

      ticketId = currentThread?.ticket_id || `TKT-${Math.floor(100000 + Math.random() * 900000)}`;

      const { data: updatedThread } = await adminSupabase
        .from("support_threads")
        .update({
          is_ticket: true,
          category: category || currentThread?.category || "General Inquiry",
          ticket_id: ticketId,
          unread_count_admin: (currentThread?.unread_count_admin || 0) + 1,
          status: "Waiting",
          updated_at: new Date().toISOString(),
        })
        .eq("id", threadId)
        .select()
        .single();

      newThread = updatedThread || currentThread;
    }

    // Insert user's message
    const { data: userMsg, error: userMsgErr } = await adminSupabase
      .from("support_messages")
      .insert({
        thread_id: threadId,
        sender: "Client",
        text: messageText.trim(),
      })
      .select()
      .single();

    if (userMsgErr) throw userMsgErr;

    // Insert bot reply
    const botReplyText = `Thank you! We have created your ticket (#${ticketId}) for ${category || "General Inquiry"}. One of our agents will reply as soon as possible.`;
    const { data: botMsg } = await adminSupabase
      .from("support_messages")
      .insert({
        thread_id: threadId,
        sender: "Admin",
        text: botReplyText,
      })
      .select()
      .single();

    return NextResponse.json({
      success: true,
      thread: newThread,
      threadId,
      ticketId,
      userMessage: userMsg,
      botMessage: botMsg,
    });
  } catch (error: any) {
    console.error("Error in support tickets POST:", error);
    return NextResponse.json({ error: error.message || "Failed to process ticket" }, { status: 500 });
  }
}
