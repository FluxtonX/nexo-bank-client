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
    const leewayMs = 12 * 60 * 60 * 1000;

    if (now > expiresAt + leewayMs) {
      return NextResponse.json({ error: "Verification code has expired" }, { status: 400 });
    }

    // 3. Mark OTP as verified and delete it
    const { error: deleteError } = await supabaseAdmin
      .from("email_otps")
      .delete()
      .eq("email", email);

    if (deleteError) {
      console.error("Error deleting OTP:", deleteError);
    }

    return NextResponse.json({ success: true, message: "OTP verified successfully for withdrawal" });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
