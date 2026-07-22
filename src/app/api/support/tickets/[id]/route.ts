import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: threadId } = await context.params;

    // Fetch the thread
    const { data: thread, error: threadError } = await supabase
      .from("support_threads")
      .select("*")
      .eq("id", threadId)
      .eq("user_id", user.id)
      .single();

    if (threadError) throw threadError;
    if (!thread) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Fetch all messages for this thread
    const { data: messages, error: messagesError } = await supabase
      .from("support_messages")
      .select("*")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true });

    if (messagesError) throw messagesError;

    return NextResponse.json({ thread, messages: messages || [] });
  } catch (error: any) {
    console.error("Error fetching support ticket:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: threadId } = await context.params;
    const { text } = await request.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Message text is required" }, { status: 400 });
    }

    // Verify the thread belongs to this user
    const { data: thread, error: threadError } = await supabase
      .from("support_threads")
      .select("*")
      .eq("id", threadId)
      .eq("user_id", user.id)
      .single();

    if (threadError) throw threadError;
    if (!thread) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Insert the message
    const { data: newMessage, error: messageError } = await supabase
      .from("support_messages")
      .insert({
        thread_id: threadId,
        sender: "Client",
        text: text.trim(),
      })
      .select()
      .single();

    if (messageError) throw messageError;

    // Update thread's updated_at and unread count for admin
    await supabase
      .from("support_threads")
      .update({
        updated_at: new Date().toISOString(),
        unread_count_admin: (thread.unread_count_admin || 0) + 1,
        status: thread.status === "Resolved" ? "Waiting" : thread.status,
      })
      .eq("id", threadId);

    // Send notification to admin about new message
    await supabase
      .from("notifications")
      .insert({
        audience: "Admin",
        type: "Info",
        title: "New Support Message",
        message: `User has sent a new message in support ticket #${threadId.slice(0, 8).toUpperCase()}.`,
        is_read: false,
        link: "/dashboard/support/tickets/" + threadId,
      });

    return NextResponse.json({ message: newMessage });
  } catch (error: any) {
    console.error("Error sending support message:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: threadId } = await context.params;

    // Verify the thread belongs to this user
    const { data: thread, error: threadError } = await supabase
      .from("support_threads")
      .select("id")
      .eq("id", threadId)
      .eq("user_id", user.id)
      .single();

    if (threadError) throw threadError;
    if (!thread) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Delete messages first
    const { error: deleteMessagesError } = await supabase
      .from("support_messages")
      .delete()
      .eq("thread_id", threadId);
    
    if (deleteMessagesError) throw deleteMessagesError;

    // Delete the thread
    const { error: deleteThreadError } = await supabase
      .from("support_threads")
      .delete()
      .eq("id", threadId);

    if (deleteThreadError) throw deleteThreadError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting support ticket:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
