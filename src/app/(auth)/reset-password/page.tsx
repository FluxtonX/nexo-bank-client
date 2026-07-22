"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Validation
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  const canProceed = hasMinLength && hasUppercase && hasNumber && password !== "" && password === confirmPassword;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update password");
      }

      router.push("/login?message=Password+updated+successfully.+Please+sign+in.");
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1855C0] bg-gradient-to-br from-[#1C5BD0] to-[#123E95] flex flex-col items-center justify-center p-6 relative">
      
      {/* Back to home arrow */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Home</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col items-center mb-6">
        <div className="mb-4 flex justify-center">
          <Image 
            src="/cdnt-logo.png" 
            alt="CDNT Bank Logo" 
            width={450} 
            height={150} 
            className="h-20 md:h-24 w-auto object-contain"
            priority
            unoptimized={true}
          />
        </div>
        <h1 className="text-white text-2xl font-bold mb-1">Set New Password</h1>
        <p className="text-blue-100 text-[14px]">Choose a strong password to secure your account</p>
      </div>

      {/* Reset Password Card */}
      <div className="bg-white w-full max-w-[420px] rounded-[20px] p-6 md:p-8 shadow-2xl shadow-black/20">
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-[14px] font-medium border border-red-100 text-center mb-5">
            {error}
            <div className="mt-2">
              <Link href="/forgot-password" className="text-[#113285] font-bold hover:underline">
                Request a new code
              </Link>
            </div>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleUpdate}>
          
          <div className="space-y-1.5">
            <label className="block text-[13px] font-bold text-[#0A0F2C]">New Password</label>
            <input 
              type="password" 
              placeholder="Enter new password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#1A3FBB] focus:border-transparent transition-all placeholder:text-gray-400"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[13px] font-bold text-[#0A0F2C]">Confirm Password</label>
            <input 
              type="password" 
              placeholder="Confirm new password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#1A3FBB] focus:border-transparent transition-all placeholder:text-gray-400"
              required
            />
          </div>

          {/* Password Requirements */}
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

          <button 
            type="submit"
            disabled={!canProceed || isLoading}
            className="w-full bg-[#113285] hover:bg-[#0D266A] disabled:opacity-60 disabled:hover:bg-[#113285] text-white font-bold text-[15px] py-3.5 rounded-xl transition-colors shadow-md mt-2 flex justify-center items-center"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              "Update password"
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-gray-100 text-center">
          <p className="text-[13px] text-gray-500">
            Remembered your password? <Link href="/login" className="text-[#113285] font-bold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      {/* Footer text */}
      <p className="text-blue-200/70 text-xs mt-6">
        Protected by bank-grade encryption and security
      </p>

    </div>
  );
}
