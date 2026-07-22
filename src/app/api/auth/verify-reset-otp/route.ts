import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import crypto from "crypto";
import { cookies } from "next/headers";

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
      return NextResponse.json({ error: "No reset code found for this email" }, { status: 404 });
    }

    // 2. Validate the OTP
    if (otpRecord.code !== code) {
      return NextResponse.json({ error: "Invalid reset code" }, { status: 400 });
    }

    if (otpRecord.verified) {
      return NextResponse.json({ error: "Code already used" }, { status: 400 });
    }

    const now = new Date().getTime();
    const expiresAt = new Date(otpRecord.expires_at).getTime();
    const leewayMs = 12 * 60 * 60 * 1000;

    if (now > expiresAt + leewayMs) {
      return NextResponse.json({ error: "Reset code has expired" }, { status: 400 });
    }

    // 3. Generate a temporary reset session token (6 characters to fit any potential column length constraints)
    const resetSessionId = crypto.randomBytes(3).toString('hex'); // 6 hex characters
    const newExpiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins

    // 4. Replace the email_otps record to act as a temporary session
    await supabaseAdmin.from("email_otps").delete().eq("email", email);

    const { error: insertError } = await supabaseAdmin
      .from("email_otps")
      .insert({
        email,
        code: resetSessionId,
        verified: true,
        expires_at: newExpiresAt,
      });

    if (insertError) {
      console.error("Error creating reset session:", insertError);
      return NextResponse.json({ error: "Failed to create reset session" }, { status: 500 });
    }

    // 5. Set HttpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set("reset_session_id", resetSessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60, // 15 minutes
      path: "/",
    });

    return NextResponse.json({ success: true, message: "Code verified successfully" });
  } catch (error) {
    console.error("Verify reset OTP error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
