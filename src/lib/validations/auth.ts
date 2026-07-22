import { z } from "zod";

const strongPassword = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must include an uppercase letter")
  .regex(/[a-z]/, "Password must include a lowercase letter")
  .regex(/[0-9]/, "Password must include a number");

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  country: z.string().min(2, "Country is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(8, "Phone number is required"),
  password: strongPassword,
  acceptedTerms: z
    .boolean()
    .refine((value) => value === true, "Terms, privacy, and risk disclosure are required"),
});

export const otpSchema = z.object({
  code: z.string().length(6, "Enter the 6-digit code"),
});

export const resetPasswordSchema = z
  .object({
    password: strongPassword,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });
