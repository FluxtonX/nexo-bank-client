"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const msg = searchParams.get("message");
    if (msg) {
      setMessage(msg.replace(/\+/g, " "));
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      if (signInError.message.includes("Invalid login credentials")) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError(signInError.message);
      }
      setIsLoading(false);
      return;
    } else {
      // Record the session/device
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const ua = navigator.userAgent;
        let browser = "Unknown Browser";
        if (ua.includes("Chrome")) browser = "Chrome";
        else if (ua.includes("Firefox")) browser = "Firefox";
        else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
        else if (ua.includes("Edge")) browser = "Edge";
        
        let os = "Unknown OS";
        if (ua.includes("Win")) os = "Windows";
        else if (ua.includes("Mac")) os = "MacOS";
        else if (ua.includes("Linux")) os = "Linux";
        else if (ua.includes("Android")) os = "Android";
        else if (ua.includes("like Mac")) os = "iOS";

        try {
          // Explicitly record login event to capture IP and update last_login
          await fetch('/api/auth/record-login', { method: 'POST' });

          const { data: sessionData } = await supabase.from('user_sessions').insert({
            user_id: user.id,
            device_name: `${os} Device`,
            browser,
            os,
            location: "Unknown Location",
            is_current: true
          }).select().single();

          if (sessionData) {
            localStorage.setItem('current_session_id', sessionData.id);
          }
        } catch (err) {
          console.error("Failed to record session", err);
        }
      }
      
      router.push("/dashboard");
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
        <h1 className="text-white text-2xl font-bold mb-1">Welcome Back</h1>
        <p className="text-blue-100 text-[14px]">Sign in to your CDNT account</p>
      </div>

      {/* Login Card */}
      <div className="bg-white w-full max-w-[420px] rounded-[20px] p-6 md:p-8 shadow-2xl shadow-black/20">
        
        {message && (
          <div className="bg-green-50 text-green-600 p-4 rounded-xl text-[14px] font-medium border border-green-100 text-center mb-5">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-[14px] font-medium border border-red-100 text-center mb-5">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleLogin}>
          
          <div className="space-y-1.5">
            <label className="block text-[13px] font-bold text-[#0A0F2C]">Email Address</label>
            <input 
              type="email" 
              placeholder="your@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#1A3FBB] focus:border-transparent transition-all placeholder:text-gray-400"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[13px] font-bold text-[#0A0F2C]">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#1A3FBB] focus:border-transparent transition-all placeholder:text-gray-400 pr-12"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-gray-300 text-[#1A3FBB] focus:ring-[#1A3FBB]" 
              />
              <span className="text-[14px] font-bold text-[#0A0F2C]">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-[14px] text-[#1A3FBB] hover:underline font-medium">
              Forgot password?
            </Link>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#113285] hover:bg-[#0D266A] disabled:opacity-60 disabled:hover:bg-[#113285] text-white font-bold text-[15px] py-3.5 rounded-xl transition-colors shadow-md mt-2 flex justify-center items-center"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              "Continue"
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-gray-100 text-center">
          <p className="text-[13px] text-gray-500">
            Don't have an account? <Link href="/register" className="text-[#113285] font-bold hover:underline">Sign up now</Link>
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1855C0] flex items-center justify-center text-white">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
