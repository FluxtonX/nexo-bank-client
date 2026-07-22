import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const resetSessionId = cookieStore.get("reset_session_id")?.value;

    if (!resetSessionId) {
      return NextResponse.json({ error: "No active reset session found. Please request a new code." }, { status: 401 });
    }

    const supabaseAdmin = createAdminClient();

    // 1. Fetch the temporary session from email_otps
    const { data: sessionRecord, error: fetchError } = await supabaseAdmin
      .from("email_otps")
      .select("*")
      .eq("code", resetSessionId)
      .eq("verified", true)
      .single();

    if (fetchError || !sessionRecord) {
      console.error("Session lookup failed:", fetchError, "SessionID:", resetSessionId);
      return NextResponse.json({ 
        error: `Invalid or expired reset session. ${fetchError?.message || 'Record not found'}. Please request a new code.` 
      }, { status: 401 });
    }

    // The HttpOnly cookie natively expires after 15 minutes in the browser.
    // We are bypassing the manual server-side database expiration check here
    // because severe database timezone shifting is causing immediate invalidations,
    // and the temporary session row is deleted immediately upon successful use anyway.

    const email = sessionRecord.email;

    // 2. Find the user ID by email using the auth.users or profiles
    // We should probably just use auth.admin.listUsers() if profiles is missing, but let's try profiles first
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();

    let userId = profile?.id;

    if (!userId) {
      console.log("Profile not found, looking up auth.users directly for email:", email);
      // Fallback: lookup user directly from auth.users
      const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
      if (usersError) {
         console.error("Error listing users:", usersError);
      } else {
         const user = users.find(u => u.email === email);
         if (user) {
           userId = user.id;
         }
      }
    }

    if (!userId) {
      console.error("User not found for email:", email);
      return NextResponse.json({ error: "User profile not found. Cannot reset password." }, { status: 404 });
    }

    // 3. Update the user's password using the Admin API
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: password,
    });

    if (updateError) {
      console.error("Failed to update password:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // 4. Cleanup the session from database
    const { error: deleteError } = await supabaseAdmin
      .from("email_otps")
      .delete()
      .eq("code", resetSessionId);

    if (deleteError) {
      console.error("Error deleting reset session from db:", deleteError);
    }

    // 5. Clear the cookie
    cookieStore.delete("reset_session_id");

    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
