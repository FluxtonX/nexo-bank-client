"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Lock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/toast";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import { cn } from "@/lib/utils";

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-2 text-sm text-rose-600 font-medium">{message}</p>;
}

function SecureBadge() {
  return (
    <div className="flex items-center justify-center gap-2 py-4 border-t border-banking-border mt-6">
      <ShieldCheck className="h-4 w-4 text-emerald-500" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-banking-muted">
        256-bit AES Encrypted Connection
      </span>
    </div>
  );
}

export function LoginForm() {
  const router = useRouter();
  const { notify } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    console.log("Login ready", values);
    notify({
      title: "Verifying credentials...",
      description: "Establishing an encrypted session with the CDNT server.",
    });

    // Mock login delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    notify({
      title: "Login Successful",
      description: "Redirecting you to your Command Center.",
    });
    
    router.push("/kyc");
  }


  return (
    <div className="space-y-6">
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="mb-2 block text-sm font-bold text-banking-text">
            Email address
          </label>
          <div className="relative">
            <input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              className={cn(
                "h-14 w-full rounded-lg border bg-white px-4 text-sm outline-none transition-all focus:ring-2 focus:ring-banking-blue/20",
                errors.email ? "border-rose-300 bg-rose-50/30" : "border-banking-border focus:border-banking-blue shadow-sm"
              )}
            />
          </div>
          <ErrorText message={errors.email?.message} />
        </div>
        
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-bold text-banking-text">
              Password
            </label>
            <Link href="/forgot-password" shakes-on-hover="true" className="text-xs font-bold text-banking-blue hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className={cn(
                "h-14 w-full rounded-lg border bg-white px-4 text-sm outline-none transition-all focus:ring-2 focus:ring-banking-blue/20",
                errors.password ? "border-rose-300 bg-rose-50/30" : "border-banking-border focus:border-banking-blue shadow-sm"
              )}
            />
          </div>
          <ErrorText message={errors.password?.message} />
        </div>

        <div className="flex items-center gap-3 py-1">
          <input type="checkbox" id="remember" className="h-5 w-5 rounded border-banking-border text-banking-blue focus:ring-banking-blue cursor-pointer" />
          <label htmlFor="remember" className="text-sm font-medium text-banking-muted cursor-pointer">
            Trust this device for 30 days
          </label>
        </div>

        <button
          disabled={isSubmitting}
          className="group relative inline-flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-banking-blue px-6 text-sm font-bold text-white shadow-xl transition-all hover:bg-banking-navy active:scale-[0.98] disabled:opacity-70"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Sign in to CDNT
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </button>
      </form>
      
      <SecureBadge />

      <p className="text-center text-sm text-banking-muted font-medium">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-bold text-banking-blue hover:underline">
          Join CDNT today
        </Link>
      </p>
    </div>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const { notify } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      country: "",
      email: "",
      phone: "",
      password: "",
      acceptedTerms: false,
    },
  });

  async function onSubmit(values: RegisterValues) {
    console.log("Registration ready", values);
    notify({
      title: "Verifying information...",
      description: "Our system is validating your registration details.",
    });

    // Mock registration delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    notify({
      title: "Account Created",
      description: "Welcome to CDNT. Let's verify your identity.",
    });

    router.push("/kyc");
  }


  return (
    <div className="space-y-6">
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold">Full name</label>
            <input
              {...register("fullName")}
              className={cn(
                "h-12 w-full rounded-lg border bg-white px-4 text-sm outline-none transition-all focus:ring-2 focus:ring-banking-blue/20 shadow-sm",
                errors.fullName ? "border-rose-300 bg-rose-50/30" : "border-banking-border focus:border-banking-blue"
              )}
              placeholder="e.g. John Doe"
            />
            <ErrorText message={errors.fullName?.message} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold">Country</label>
            <input
              {...register("country")}
              className={cn(
                "h-12 w-full rounded-lg border bg-white px-4 text-sm outline-none transition-all focus:ring-2 focus:ring-banking-blue/20 shadow-sm",
                errors.country ? "border-rose-300 bg-rose-50/30" : "border-banking-border focus:border-banking-blue"
              )}
              placeholder="e.g. Canada"
            />
            <ErrorText message={errors.country?.message} />
          </div>
        </div>
        
        <div>
          <label className="mb-2 block text-sm font-bold">Email address</label>
          <input
            {...register("email")}
            type="email"
            className={cn(
              "h-12 w-full rounded-lg border bg-white px-4 text-sm outline-none transition-all focus:ring-2 focus:ring-banking-blue/20 shadow-sm",
              errors.email ? "border-rose-300 bg-rose-50/30" : "border-banking-border focus:border-banking-blue"
            )}
            placeholder="your@email.com"
          />
          <ErrorText message={errors.email?.message} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">Phone number</label>
          <input
            {...register("phone")}
            className={cn(
              "h-12 w-full rounded-lg border bg-white px-4 text-sm outline-none transition-all focus:ring-2 focus:ring-banking-blue/20 shadow-sm",
              errors.phone ? "border-rose-300 bg-rose-50/30" : "border-banking-border focus:border-banking-blue"
            )}
            placeholder="+1 (555) 000-0000"
          />
          <ErrorText message={errors.phone?.message} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">Create Password</label>
          <input
            {...register("password")}
            type="password"
            className={cn(
              "h-12 w-full rounded-lg border bg-white px-4 text-sm outline-none transition-all focus:ring-2 focus:ring-banking-blue/20 shadow-sm",
              errors.password ? "border-rose-300 bg-rose-50/30" : "border-banking-border focus:border-banking-blue"
            )}
            placeholder="At least 8 characters"
          />
          <ErrorText message={errors.password?.message} />
        </div>

        <div className="space-y-4 rounded-lg bg-banking-offWhite p-4 border border-banking-border">
          <div className="flex gap-3">
            <input
              {...register("acceptedTerms")}
              type="checkbox"
              id="terms"
              className="mt-1 h-5 w-5 rounded border-banking-border text-banking-blue focus:ring-banking-blue cursor-pointer"
            />
            <label htmlFor="terms" className="text-xs leading-relaxed text-banking-muted cursor-pointer font-medium">
              I agree to the <Link href="/terms" className="text-banking-blue hover:underline">Terms of Service</Link>, <Link href="/privacy" className="text-banking-blue hover:underline">Privacy Policy</Link>, and acknowledge the crypto asset risk disclosure.
            </label>
          </div>
          <ErrorText message={errors.acceptedTerms?.message} />
        </div>

        <button
          disabled={isSubmitting}
          className="group relative inline-flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-banking-blue px-6 text-sm font-bold text-white shadow-xl transition-all hover:bg-banking-navy active:scale-[0.98] disabled:opacity-70"
        >
          <span className="relative z-10 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Create Secure Account
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </button>
      </form>

      <SecureBadge />

      <p className="text-center text-sm text-banking-muted font-medium">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-banking-blue hover:underline">
          Sign in here
        </Link>
      </p>
    </div>
  );
}

