import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const supabaseAdmin = createAdminClient();
    const body = await request.json();
    const { action, category, severity, userName, userId, details } = body;

    const { data, error } = await supabaseAdmin
      .from("security_logs")
      .insert({
        action,
        category,
        severity: severity || "Info",
        user_name: userName,
        user_id: userId,
        ip_address: request.headers.get("x-forwarded-for") || "127.0.0.1",
        details,
        user_agent: request.headers.get("user-agent") || "Unknown",
        performed_by_admin: null
      })
      .select();

    if (error) throw error;
    return NextResponse.json({ success: true, log: data[0] });
  } catch (error: any) {
    console.error("POST log-event Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
