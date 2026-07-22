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
