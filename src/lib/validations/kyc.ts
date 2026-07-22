import { z } from "zod";

export const kycPersonalSchema = z.object({
  legalName: z.string().min(2, "Legal name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  nationality: z.string().min(2, "Nationality is required"),
  occupation: z.string().min(2, "Occupation is required"),
  sourceOfFunds: z.string().min(2, "Source of funds is required"),
  expectedMonthlyActivity: z.string().min(1, "Expected monthly activity is required"),
});

export const kycAddressSchema = z.object({
  street: z.string().min(3, "Street address is required"),
  city: z.string().min(2, "City is required"),
  province: z.string().min(2, "Province/state is required"),
  country: z.string().min(2, "Country is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  phone: z.string().min(8, "Phone number is required"),
});
