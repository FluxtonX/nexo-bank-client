"use client";

import { Shield, AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ProfileSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [kycStatus, setKycStatus] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Settings content from CMS
  const [dailyUnverified, setDailyUnverified] = useState("1,000");
  const [dailyVerified, setDailyVerified] = useState("5,000,000");
  const [monthlyUnverified, setMonthlyUnverified] = useState("10,000");
  const [monthlyVerified, setMonthlyVerified] = useState("50,000,000");

  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        setUserId(user.id);
        setEmail(user.email || "");
        setPhone(user.user_metadata?.phone || "");

        // Also fetch from profiles table
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, kyc_verified")
          .eq("id", user.id)
          .single();

        setFullName(profile?.full_name || user.user_metadata?.full_name || "");

        // Let's get actual KYC status if possible, otherwise rely on profile.kyc_verified
        const { data: kyc } = await supabase
          .from("kyc_submissions")
          .select("status, rejection_reason")
          .eq("user_id", user.id)
          .single();

        if (kyc?.status === "approved" || profile?.kyc_verified) {
          setKycStatus("verified");
        } else if (kyc?.status === "pending") {
          setKycStatus("pending");
        } else if (kyc?.status === "rejected") {
          setKycStatus("rejected");
          setRejectionReason(kyc.rejection_reason);
        } else {
          setKycStatus("unverified");
        }

      } catch (error) {
        console.error("Failed to load profile data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [supabase]);

  // Fetch settings content from site_content
  useEffect(() => {
    async function loadSettingsContent() {
      try {
        const { data, error } = await supabase
          .from("site_content")
          .select("key, value")
          .eq("category", "settings");
        
        if (!error && data) {
          data.forEach((row) => {
            switch (row.key) {
              case "settings.daily_unverified":
                setDailyUnverified(row.value);
                break;
              case "settings.daily_verified":
                setDailyVerified(row.value);
                break;
              case "settings.monthly_unverified":
                setMonthlyUnverified(row.value);
                break;
              case "settings.monthly_verified":
                setMonthlyVerified(row.value);
                break;
              default:
                break;
            }
          });
        }
      } catch (err) {
        console.error("Error loading settings content:", err);
      }
    }
    loadSettingsContent();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setMessage(null);
    setIsSaving(true);

    try {
      // 1. Update Auth metadata and Email
      // Note: Changing email in Supabase sends a confirmation email to both addresses by default unless disabled.
      const { error: authError } = await supabase.auth.updateUser({
        email,
        data: { full_name: fullName, phone }
      });

      if (authError) throw authError;

      // 2. Update Profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ full_name: fullName })
        .eq("id", userId);

      if (profileError) throw profileError;

      setMessage({ type: "success", text: "Profile updated successfully. If you changed your email, check your inbox to confirm." });

    } catch (error: any) {
      console.error("Update error:", error);
      setMessage({ type: "error", text: error.message || "Failed to update profile." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-64 bg-gray-100 rounded mb-6"></div>
          <div className="space-y-6">
            <div className="h-12 bg-gray-50 rounded-xl"></div>
            <div className="h-12 bg-gray-50 rounded-xl"></div>
            <div className="h-12 bg-gray-50 rounded-xl"></div>
          </div>
        </section>
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
          <div className="h-24 bg-gray-50 rounded-xl mb-4"></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-24 bg-gray-50 rounded-xl"></div>
            <div className="h-24 bg-gray-50 rounded-xl"></div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Personal Information Card */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-[18px] font-bold text-[#0A0F2C]">Personal Information</h2>
          <p className="mt-1 text-[14px] text-[#718096]">Update your account details</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 border ${message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
            }`}>
            {message.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-600" />
            )}
            <p className="text-[14px] font-medium leading-relaxed">{message.text}</p>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#0A0F2C]">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-[15px] text-[#0A0F2C] outline-none transition-colors focus:border-[#113285] focus:ring-1 focus:ring-[#113285] disabled:opacity-60 disabled:bg-gray-50"
              disabled={isSaving}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#0A0F2C]">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-[15px] text-[#0A0F2C] outline-none transition-colors focus:border-[#113285] focus:ring-1 focus:ring-[#113285] disabled:opacity-60 disabled:bg-gray-50"
              disabled={isSaving}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#0A0F2C]">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-[15px] text-[#0A0F2C] outline-none transition-colors focus:border-[#113285] focus:ring-1 focus:ring-[#113285] disabled:opacity-60 disabled:bg-gray-50"
              disabled={isSaving}
              required
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center justify-center min-w-[140px] rounded-xl bg-[#113285] px-6 py-3 text-[14px] font-bold text-white shadow-sm transition-colors hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-[#113285] focus:ring-offset-2 disabled:opacity-70"
            >
              {isSaving ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Account Status Card */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-[18px] font-bold text-[#0A0F2C]">Account Status</h2>
          <p className="mt-1 text-[14px] text-[#718096]">Your verification and account limits</p>
        </div>

        <div className={`mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl p-5 ${kycStatus === 'verified' ? 'bg-[#F4F8FF]' : kycStatus === 'rejected' ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'}`}>
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center">
              {kycStatus === 'verified' ? (
                <Shield className="h-6 w-6 text-[#38A169]" strokeWidth={2} />
              ) : kycStatus === 'pending' ? (
                <AlertCircle className="h-6 w-6 text-yellow-500" strokeWidth={2} />
              ) : kycStatus === 'rejected' ? (
                <AlertCircle className="h-6 w-6 text-red-500" strokeWidth={2} />
              ) : (
                <AlertCircle className="h-6 w-6 text-gray-400" strokeWidth={2} />
              )}
            </div>
            <div>
              <p className="text-[15px] font-bold text-[#0A0F2C]">KYC Verification</p>
              <p className="text-[14px] text-[#718096] mt-0.5">
                {kycStatus === 'verified' ? 'Identity verified' : kycStatus === 'pending' ? 'Verification pending' : kycStatus === 'rejected' ? 'Verification rejected' : 'Unverified'}
              </p>
            </div>
          </div>
          {kycStatus === 'verified' ? (
            <span className="inline-flex shrink-0 items-center rounded-full bg-[#C6F6D5] px-3 py-1 text-[12px] font-bold text-[#22543D]">
              Verified
            </span>
          ) : kycStatus === 'pending' ? (
            <span className="inline-flex shrink-0 items-center rounded-full bg-yellow-100 px-3 py-1 text-[12px] font-bold text-yellow-800">
              Pending
            </span>
          ) : kycStatus === 'rejected' ? (
            <span className="inline-flex shrink-0 items-center rounded-full bg-red-100 px-3 py-1 text-[12px] font-bold text-red-800">
              Rejected
            </span>
          ) : (
            <span className="inline-flex shrink-0 items-center rounded-full bg-gray-200 px-3 py-1 text-[12px] font-bold text-gray-700">
              Unverified
            </span>
          )}
        </div>

        {kycStatus === 'rejected' && rejectionReason && (
          <div className="mb-4 bg-white border border-red-200 rounded-xl p-4">
            <p className="text-[13px] font-bold text-red-800 mb-1">Rejection Reason:</p>
            <p className="text-[14px] text-red-600 leading-relaxed">{rejectionReason}</p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 p-5">
            <p className="text-[13px] font-medium text-[#718096]">Daily Withdrawal Limit</p>
            <p className="mt-1 text-[24px] font-black tracking-tight text-[#0A0F2C]">
              {kycStatus === 'verified' ? `$${dailyVerified}` : `$${dailyUnverified}`}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 p-5">
            <p className="text-[13px] font-medium text-[#718096]">Monthly Limit</p>
            <p className="mt-1 text-[24px] font-black tracking-tight text-[#0A0F2C]">
              {kycStatus === 'verified' ? `$${monthlyVerified}` : `$${monthlyUnverified}`}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
