"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect, Suspense } from "react";

function VerifyResetOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [cooldown, setCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  
  const [values, setValues] = useState(["", "", "", "", "", ""]);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  function updateDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...values];
    next[index] = digit;
    setValues(next);
    if (digit && index < refs.current.length - 1) {
      refs.current[index + 1]?.focus();
    }
  }

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("No email found to verify. Please try requesting a reset code again.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    const code = values.join("");

    try {
      const response = await fetch("/api/auth/verify-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }

      setSuccess("Code verified successfully! Redirecting...");
      setTimeout(() => {
        router.push("/reset-password");
      }, 1000);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || !email) return;
    
    setIsResending(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "password-reset" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend code");
      }

      setSuccess("A new reset code has been sent to your email.");
      setCooldown(60);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1855C0] bg-gradient-to-br from-[#1C5BD0] to-[#123E95] flex flex-col items-center justify-center p-6 relative">
      
      {/* Back to home arrow */}
      <Link 
        href="/forgot-password" 
        className="absolute top-8 left-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Account Recovery</span>
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
        <h1 className="text-white text-2xl font-bold mb-1">Verify Reset Code</h1>
        <p className="text-blue-100 text-[14px]">Check your inbox for the 6-digit reset code</p>
      </div>

      {/* Verification Card */}
      <div className="bg-white w-full max-w-[420px] rounded-[20px] p-6 md:p-8 shadow-2xl shadow-black/20 text-center">
        
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 bg-[#F0F5FF] rounded-full flex items-center justify-center border border-blue-50">
            <KeyRound className="h-5 w-5 text-[#113285]" strokeWidth={2} />
          </div>
        </div>

        <h2 className="text-[18px] font-bold text-[#0A0F2C] mb-1">Reset Verification</h2>
        <p className="text-[14px] text-gray-500 mb-6">
          {email ? `Enter the 6-digit code sent to ${email}.` : "Enter the 6-digit code sent to your registered email."}
        </p>

        <form className="space-y-5 text-left" onSubmit={handleVerify}>
          
          <div className="space-y-3">
            <label className="block text-[13px] font-bold text-[#0A0F2C]">Verification Code</label>
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <input
                  key={index}
                  ref={(node) => {
                    refs.current[index] = node;
                  }}
                  value={values[index]}
                  onChange={(event) => updateDigit(index, event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Backspace" && !values[index] && index > 0) {
                      refs.current[index - 1]?.focus();
                    }
                  }}
                  inputMode="numeric"
                  maxLength={1}
                  aria-label={`OTP digit ${index + 1}`}
                  className="w-full aspect-[3/4] rounded-xl border border-gray-200 text-xl font-bold text-center text-[#0A0F2C] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#1A3FBB]"
                  required
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100 text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-xl text-sm font-medium border border-green-100 text-center">
              {success}
            </div>
          )}

          <div className="flex gap-4 pt-2">
            <button 
              type="submit"
              disabled={isLoading || values.some(v => v === "")}
              className="w-full bg-[#113285] hover:bg-[#0D266A] disabled:opacity-60 disabled:hover:bg-[#113285] text-white font-bold text-[15px] py-3.5 rounded-xl transition-colors shadow-md flex justify-center items-center"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                "Verify Code"
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-gray-100 text-center">
          <p className="text-[13px] text-gray-500">
            Did not receive it?{" "}
            <button 
              onClick={handleResend}
              disabled={cooldown > 0 || isResending}
              className="text-[#113285] font-bold hover:underline focus:outline-none disabled:opacity-50 disabled:hover:no-underline"
            >
              {isResending ? "Sending..." : cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
            </button>
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

export default function VerifyResetOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1855C0] flex items-center justify-center text-white">Loading...</div>}>
      <VerifyResetOtpForm />
    </Suspense>
  );
}
