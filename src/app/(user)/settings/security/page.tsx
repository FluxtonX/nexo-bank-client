"use client";

import { useState, useEffect } from "react";
import { Shield, CheckCircle2, Circle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { validatePasswordRules } from "@/lib/utils";

interface UserSession {
  id: string;
  device_name: string;
  os: string;
  browser: string;
  location: string;
  last_active: string;
}

export default function SecuritySettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Sessions state
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchUserAndData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || null);
        
        // Fetch sessions
        const localSessionId = localStorage.getItem('current_session_id');
        if (localSessionId) setCurrentSessionId(localSessionId);

        const { data: sessionsData } = await supabase
          .from('user_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('last_active', { ascending: false });

        if (sessionsData) setSessions(sessionsData);
        setIsLoadingSessions(false);
      }
    };
    fetchUserAndData();
  }, [supabase]);

  // Session Methods
  const handleRevokeSession = async (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    await supabase.from('user_sessions').delete().eq('id', id);
    alert("Session revoked");
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    
    if (diffHours < 1) return "Active now";
    if (diffHours < 24) return `${Math.floor(diffHours)} hours ago`;
    return `${Math.floor(diffHours / 24)} days ago`;
  };

  const { hasMinLength, hasUppercase, hasNumber } = validatePasswordRules(newPassword);
  
  const passwordsMatch = newPassword === confirmPassword && newPassword !== "";
  const canSubmit = currentPassword.length > 0 && hasMinLength && hasUppercase && hasNumber && passwordsMatch && !isLoading;

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !userEmail) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // 1. Verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password: currentPassword,
    });

    if (signInError) {
      setError("Incorrect current password.");
      setIsLoading(false);
      return;
    }

    // 2. Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      // Clear success message after a few seconds
      setTimeout(() => setSuccess(null), 3000);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Change Password Card */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-[18px] font-bold text-[#0A0F2C]">Change Password</h2>
          <p className="mt-1 text-[14px] text-[#718096]">Update your password regularly for security</p>
        </div>

        <form className="space-y-5" onSubmit={handleUpdatePassword}>
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#0A0F2C]">Current Password</label>
            <input 
              type="password" 
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-[15px] text-[#0A0F2C] outline-none transition-colors focus:border-[#113285] focus:ring-1 focus:ring-[#113285]" 
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#0A0F2C]">New Password</label>
            <input 
              type="password" 
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-[15px] text-[#0A0F2C] outline-none transition-colors focus:border-[#113285] focus:ring-1 focus:ring-[#113285]" 
              required
            />
          </div>
          
          {/* Password Requirements */}
          {newPassword.length > 0 && (
            <div className="bg-[#F8F9FB] border border-gray-100 rounded-xl p-4 mt-2">
              <p className="text-[12px] font-bold text-[#0A0F2C] mb-2.5">Password must contain:</p>
              <ul className="space-y-2">
                <li className={`flex items-center gap-2 text-[12px] ${hasMinLength ? "text-[#10B981]" : "text-gray-400"}`}>
                  {hasMinLength ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                  At least 8 characters
                </li>
                <li className={`flex items-center gap-2 text-[12px] ${hasUppercase ? "text-[#10B981]" : "text-gray-400"}`}>
                  {hasUppercase ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                  One uppercase letter
                </li>
                <li className={`flex items-center gap-2 text-[12px] ${hasNumber ? "text-[#10B981]" : "text-gray-400"}`}>
                  {hasNumber ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                  One number
                </li>
              </ul>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#0A0F2C]">Confirm New Password</label>
            <input 
              type="password" 
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-[15px] text-[#0A0F2C] outline-none transition-colors focus:border-[#113285] focus:ring-1 focus:ring-[#113285]" 
              required
            />
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="text-[12px] text-red-500 mt-1">Passwords do not match</p>
            )}
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-[13px] text-red-600 font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-[13px] text-green-600 font-medium">
              {success}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button 
              type="submit"
              disabled={!canSubmit}
              className="rounded-xl bg-[#113285] px-6 py-3 text-[14px] font-bold text-white shadow-sm transition-colors hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-[#113285] focus:ring-offset-2 disabled:opacity-50 disabled:hover:bg-[#113285] flex items-center justify-center min-w-[160px]"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Two-Factor Authentication Card */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-[18px] font-bold text-[#0A0F2C]">Two-Factor Authentication</h2>
          <p className="mt-1 text-[14px] text-[#718096]">Add an extra layer of security</p>
        </div>

        <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl bg-[#F4F8FF] p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center">
              <Shield className="h-6 w-6 text-[#38A169]" strokeWidth={2} />
            </div>
            <div>
              <p className="text-[15px] font-bold text-[#0A0F2C]">Authenticator App</p>
              <p className="text-[14px] text-[#718096] mt-0.5">Google Authenticator, Authy</p>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center rounded-full bg-[#C6F6D5] px-3 py-1 text-[12px] font-bold text-[#22543D]">
            Enabled
          </span>
        </div>

        <button className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-[14px] font-bold text-[#0A0F2C] shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#113285] focus:ring-offset-2">
          Reconfigure 2FA
        </button>
      </section>

      {/* Active Sessions Card */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-[18px] font-bold text-[#0A0F2C]">Active Sessions</h2>
          <p className="mt-1 text-[14px] text-[#718096]">Manage your active login sessions</p>
        </div>

        <div className="space-y-4">
          {isLoadingSessions ? (
            <div className="flex justify-center p-4">
              <span className="w-6 h-6 border-2 border-[#113285]/30 border-t-[#113285] rounded-full animate-spin"></span>
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-[14px] text-gray-500 text-center py-4">No active sessions found.</p>
          ) : (
            sessions.map((session) => {
              const isCurrent = session.id === currentSessionId;

              return (
                <div key={session.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-gray-200 p-5">
                  <div>
                    <p className="text-[15px] font-bold text-[#0A0F2C]">{session.browser} on {session.os}</p>
                    <p className="text-[14px] text-[#718096] mt-0.5">{session.location} • {formatTime(session.last_active)}</p>
                  </div>
                  {isCurrent ? (
                    <span className="inline-flex shrink-0 items-center rounded-full bg-[#C6F6D5] px-3 py-1 text-[12px] font-bold text-[#22543D]">
                      Current
                    </span>
                  ) : (
                    <button 
                      onClick={() => handleRevokeSession(session.id)}
                      className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-[13px] font-bold text-[#0A0F2C] shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#113285] focus:ring-offset-2"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
