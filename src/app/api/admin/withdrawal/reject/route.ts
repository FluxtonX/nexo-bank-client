import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const { withdrawalId, adminId, reason } = await req.json();

    if (!withdrawalId) {
      return NextResponse.json({ error: "Withdrawal ID is required" }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    // Get withdrawal details
    const { data: withdrawal, error: fetchError } = await supabaseAdmin
      .from("withdrawal_requests")
      .select("*")
      .eq("id", withdrawalId)
      .single();

    if (fetchError || !withdrawal) {
      return NextResponse.json({ error: "Withdrawal request not found" }, { status: 404 });
    }

    if (withdrawal.status !== "pending") {
      return NextResponse.json({ error: "Withdrawal is not in pending status" }, { status: 400 });
    }

    // Update withdrawal status to rejected
    const { error: updateError } = await supabaseAdmin
      .from("withdrawal_requests")
      .update({ 
        status: "rejected",
        reviewed_at: new Date().toISOString(),
        reviewed_by: adminId,
        rejection_reason: reason || "Admin rejected"
      })
      .eq("id", withdrawalId);

    if (updateError) {
      return NextResponse.json({ error: "Failed to reject withdrawal" }, { status: 500 });
    }

    // Add notification for user
    await supabaseAdmin.from("notifications").insert({
      user_id: withdrawal.user_id,
      type: "Warning",
      title: "Withdrawal Rejected",
      message: `Your withdrawal of $${Number(withdrawal.amount).toLocaleString()} CAD was rejected. ${reason ? `Reason: ${reason}` : ''}`,
      audience: "User",
      is_read: false
    });

    return NextResponse.json({ success: true, message: "Withdrawal rejected successfully" });
  } catch (error) {
    console.error("Reject withdrawal error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}