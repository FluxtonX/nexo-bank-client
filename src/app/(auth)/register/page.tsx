"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, CheckCircle2, Circle, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { validatePasswordRules } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  
  // States for step 1
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  // States for step 2
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // States for step 3
  const [agreeTos, setAgreeTos] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  // Validation
  const { hasMinLength, hasUppercase, hasNumber } = validatePasswordRules(password);
  
  const canProceedStep2 = hasMinLength && hasUppercase && hasNumber && password !== "" && password === confirmPassword;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTos) return;
    
    setIsLoading(true);
    setError(null);

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Please enter a valid email and password.");
      setIsLoading(false);
      return;
    }
    
    const { error: signUpError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setIsLoading(false);
    } else {
      // Call send-otp API
      try {
        await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: normalizedEmail, purpose: "email-verification" }),
        });
      } catch (err) {
        console.error("Failed to send initial OTP", err);
      }
      
      // Success, redirect to verify-email
      router.push(`/verify-email?email=${encodeURIComponent(normalizedEmail)}`);
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
        <h1 className="text-white text-2xl font-bold mb-1">Create Your Account</h1>
        <p className="text-blue-100 text-[14px]">Join thousands of Canadians banking with crypto</p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-3 mb-6">
        {/* Step 1 */}
        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-[14px] ${step >= 1 ? "bg-[#FBBF24] text-[#0A0F2C]" : "bg-white/20 text-white"}`}>
          {step > 1 ? <Check className="w-5 h-5" strokeWidth={2.5} /> : "1"}
        </div>
        <div className={`w-12 h-[3px] rounded-full ${step >= 2 ? "bg-[#FBBF24]" : "bg-white/20"}`} />
        
        {/* Step 2 */}
        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-[14px] ${step >= 2 ? "bg-[#FBBF24] text-[#0A0F2C]" : "bg-white/20 text-white"}`}>
          {step > 2 ? <Check className="w-5 h-5" strokeWidth={2.5} /> : "2"}
        </div>
        <div className={`w-12 h-[3px] rounded-full ${step >= 3 ? "bg-[#FBBF24]" : "bg-white/20"}`} />
        
        {/* Step 3 */}
        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-[14px] ${step >= 3 ? "bg-[#FBBF24] text-[#0A0F2C]" : "bg-white/20 text-white"}`}>
          3
        </div>
      </div>

      {/* Register Card */}
      <div className="bg-white w-full max-w-[420px] rounded-[20px] p-6 md:p-8 shadow-2xl shadow-black/20 text-center relative overflow-hidden">
        
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-[18px] font-bold text-[#0A0F2C] mb-1">Personal Information</h2>
            <p className="text-[14px] text-gray-500 mb-6">Let's start with the basics</p>

            <form className="space-y-5 text-left" onSubmit={handleNext}>
              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-[#0A0F2C]">Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Smith" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#1A3FBB] focus:border-transparent transition-all placeholder:text-gray-400"
                  required
                />
              </div>

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
                <label className="block text-[13px] font-bold text-[#0A0F2C]">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="+1 (555) 000-0000" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#1A3FBB] focus:border-transparent transition-all placeholder:text-gray-400"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#113285] hover:bg-[#0D266A] text-white font-bold text-[15px] py-3.5 rounded-xl transition-colors shadow-md mt-2"
              >
                Continue
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-[18px] font-bold text-[#0A0F2C] mb-1">Secure Your Account</h2>
            <p className="text-[14px] text-gray-500 mb-6">Create a strong password</p>

            <form className="space-y-5 text-left" onSubmit={handleNext}>
              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-[#0A0F2C]">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter a strong password" 
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

              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-[#0A0F2C]">Confirm Password</label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="Re-enter your password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#1A3FBB] focus:border-transparent transition-all placeholder:text-gray-400 pr-12"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
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

              <div className="flex gap-4 pt-2">
                <button 
                  type="button"
                  onClick={handleBack}
                  className="w-1/2 bg-white border border-gray-200 hover:bg-gray-50 text-[#0A0F2C] font-bold text-[15px] py-3.5 rounded-xl transition-colors"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  disabled={!canProceedStep2}
                  className="w-1/2 bg-[#113285] hover:bg-[#0D266A] disabled:opacity-60 disabled:hover:bg-[#113285] text-white font-bold text-[15px] py-3.5 rounded-xl transition-colors shadow-md"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-[18px] font-bold text-[#0A0F2C] mb-6">Terms of Service</h2>

            <form className="space-y-5 text-left" onSubmit={handleSubmit}>
              <div className="bg-[#F8F9FB] border border-gray-100 rounded-xl p-5 space-y-4">
                <div>
                  <h3 className="text-[13px] font-bold text-[#0A0F2C] mb-1.5">Terms of Service</h3>
                  <p className="text-[12px] text-gray-500 leading-relaxed">
                    By creating an account with CDNT Bank, you agree to our terms of service and privacy policy. Your funds are protected under Canadian financial regulations.
                  </p>
                </div>
                <div>
                  <h3 className="text-[13px] font-bold text-[#0A0F2C] mb-1.5">Privacy Policy</h3>
                  <p className="text-[12px] text-gray-500 leading-relaxed">
                    We protect your personal information using bank-grade encryption and never share your data without your explicit consent.
                  </p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mt-4 font-medium border border-red-100 text-center">
                  {error}
                </div>
              )}

              <label className="flex items-start gap-3 cursor-pointer mt-4">
                <input 
                  type="checkbox" 
                  checked={agreeTos}
                  onChange={(e) => setAgreeTos(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#1A3FBB] focus:ring-[#1A3FBB]" 
                  required
                />
                <span className="text-[12px] text-[#0A0F2C] font-medium leading-snug">
                  I agree to the Terms of Service and Privacy Policy. I understand that my account will be subject to KYC verification.
                </span>
              </label>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={handleBack}
                  className="w-1/2 bg-white border border-gray-200 hover:bg-gray-50 text-[#0A0F2C] font-bold text-[15px] py-3.5 rounded-xl transition-colors"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  disabled={!agreeTos || isLoading}
                  className="w-1/2 bg-[#113285] hover:bg-[#0D266A] disabled:opacity-60 disabled:hover:bg-[#113285] text-white font-bold text-[15px] py-3.5 rounded-xl transition-colors shadow-md flex items-center justify-center"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-gray-100 text-center">
          <p className="text-[13px] text-gray-500">
            Already have an account? <Link href="/login" className="text-[#113285] font-bold hover:underline">Sign in</Link>
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
