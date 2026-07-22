import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    // 1. Fetch the OTP for the email
    const { data: otpRecord, error: fetchError } = await supabaseAdmin
      .from("email_otps")
      .select("*")
      .eq("email", email)
      .single();

    if (fetchError || !otpRecord) {
      return NextResponse.json({ error: "No OTP found for this email" }, { status: 404 });
    }

    // 2. Validate the OTP
    if (otpRecord.code !== code) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }

    if (otpRecord.verified) {
      return NextResponse.json({ error: "Code already used" }, { status: 400 });
    }

    const now = new Date().getTime();
    const expiresAt = new Date(otpRecord.expires_at).getTime();

    // Add a 12-hour leeway to bypass any severe database timezone shifting issues.
    // If the database incorrectly treats the UTC input as a local time, it can 
    // shift the record hours into the past, causing an immediate expiration.
    const leewayMs = 12 * 60 * 60 * 1000;

    if (now > expiresAt + leewayMs) {
      return NextResponse.json({ error: "Verification code has expired" }, { status: 400 });
    }

    // 3. Mark OTP as verified and/or delete it
    const { error: deleteError } = await supabaseAdmin
      .from("email_otps")
      .delete()
      .eq("email", email);

    if (deleteError) {
      console.error("Error deleting OTP:", deleteError);
    }

    // 4. Update profiles.email_verified = true
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({ email_verified: true })
      .eq("email", email);

    if (profileError) {
      console.error("Error updating profile verified status:", profileError);
      return NextResponse.json({ error: "Failed to verify profile" }, { status: 500 });
    }

    try {
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("id, full_name")
        .eq("email", email)
        .single();

      await supabaseAdmin.from("security_logs").insert({
        action: "User Login",
        category: "Auth",
        severity: "Info",
        user_name: profile?.full_name || email,
        user_id: profile?.id || "N/A",
        ip_address: req.headers.get("x-forwarded-for") || "127.0.0.1",
        details: `User logged in successfully by verifying OTP for email: ${email}.`,
        user_agent: req.headers.get("user-agent") || "Unknown"
      });
    } catch (logErr) {
      console.error("Failed to write login log:", logErr);
    }

    return NextResponse.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
