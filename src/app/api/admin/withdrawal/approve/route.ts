import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys, SendSmtpEmail } from '@getbrevo/brevo';

export async function POST(req: Request) {
  try {
    const { withdrawalId, adminId } = await req.json();

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

    // Get user details for email
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("full_name, email")
      .eq("id", withdrawal.user_id)
      .single();

    // Update withdrawal status to approved
    const { error: updateError } = await supabaseAdmin
      .from("withdrawal_requests")
      .update({ 
        status: "approved",
        reviewed_at: new Date().toISOString(),
        reviewed_by: adminId
      })
      .eq("id", withdrawalId);

    if (updateError) {
      return NextResponse.json({ error: "Failed to approve withdrawal" }, { status: 500 });
    }

    // Send approval email to user
    if (profile?.email && process.env.BREVO_API_KEY) {
      try {
        const apiInstance = new TransactionalEmailsApi();
        apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

        const sendSmtpEmail = new SendSmtpEmail();
        sendSmtpEmail.sender = { email: 'noreply@ndntbank.com', name: 'Nexo Platform' };
        sendSmtpEmail.to = [{ email: profile.email }];
        sendSmtpEmail.subject = "Your Withdrawal Has Been Approved";
        sendSmtpEmail.htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; border: 1px solid #E2E8F0; border-radius: 10px;">
            <h1 style="color: #2563EB;">Nexo Bank</h1>
            <p style="color: #4A5568; font-size: 16px;">Great news! Your withdrawal request has been approved.</p>
            
            <div style="background-color: #F8F9FA; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left;">
              <h2 style="color: #0A0F2C; margin-top: 0;">Withdrawal Details</h2>
              <p style="color: #4A5568; margin: 5px 0;"><strong>Amount:</strong> $${Number(withdrawal.amount).toLocaleString()} CAD</p>
              <p style="color: #4A5568; margin: 5px 0;"><strong>Method:</strong> Interac e-Transfer</p>
              <p style="color: #4A5568; margin: 5px 0;"><strong>Recipient Email:</strong> ${withdrawal.interac_email}</p>
              <p style="color: #4A5568; margin: 5px 0;"><strong>Security Question:</strong> ${withdrawal.security_question}</p>
            </div>
            
            <p style="color: #718096; font-size: 14px;">The funds will be transferred to your specified recipient. Please keep your security answer safe.</p>
            <p style="color: #718096; font-size: 14px;">If you have any questions, please contact our support team.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E2E8F0;">
              <p style="color: #A0AEC0; font-size: 12px;">This is an automated email. Please do not reply.</p>
            </div>
          </div>
        `;

        await apiInstance.sendTransacEmail(sendSmtpEmail);
      } catch (emailError) {
        console.error("Failed to send approval email:", emailError);
        // Continue even if email fails
      }
    }

    // Add notification for user
    await supabaseAdmin.from("notifications").insert({
      user_id: withdrawal.user_id,
      type: "Success",
      title: "Withdrawal Approved",
      message: `Your withdrawal of $${withdrawal.amount.toLocaleString()} CAD has been approved and is being processed.`,
      audience: "User",
      is_read: false
    });

    return NextResponse.json({ success: true, message: "Withdrawal approved successfully" });
  } catch (error) {
    console.error("Approve withdrawal error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}