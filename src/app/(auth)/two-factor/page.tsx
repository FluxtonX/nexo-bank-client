"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TwoFactorPage() {
  const router = useRouter();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard"); // Redirect to some logged-in state or dashboard
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

      {/* 2FA Card */}
      <div className="bg-white w-full max-w-[420px] rounded-[20px] p-6 md:p-8 shadow-2xl shadow-black/20 text-center">
        
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 bg-[#F0F5FF] rounded-full flex items-center justify-center border border-blue-50">
            <Lock className="h-5 w-5 text-[#113285]" strokeWidth={2} />
          </div>
        </div>

        <h2 className="text-[18px] font-bold text-[#0A0F2C] mb-1">Two-Factor Authentication</h2>
        <p className="text-[14px] text-gray-500 mb-6">Enter the 6-digit code from your authenticator app</p>

        <form className="space-y-5 text-left" onSubmit={handleVerify}>
          
          <div className="space-y-1.5">
            <label className="block text-[13px] font-bold text-[#0A0F2C]">Authentication Code</label>
            <input 
              type="text" 
              placeholder="0 0 0 0 0 0" 
              maxLength={6}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-2xl tracking-[0.4em] text-center font-mono focus:outline-none focus:ring-2 focus:ring-[#1A3FBB] focus:border-transparent transition-all placeholder:text-gray-300"
              required
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button 
              type="button"
              onClick={() => router.back()}
              className="w-1/2 bg-white border border-gray-200 hover:bg-gray-50 text-[#0A0F2C] font-bold text-[15px] py-3.5 rounded-xl transition-colors"
            >
              Back
            </button>
            <button 
              type="submit"
              className="w-1/2 bg-[#113285] hover:bg-[#0D266A] text-white font-bold text-[15px] py-3.5 rounded-xl transition-colors shadow-md"
            >
              Verify & Sign In
            </button>
          </div>
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
