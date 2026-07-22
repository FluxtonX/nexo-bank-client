"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/toast";
import { kycAddressSchema, kycPersonalSchema } from "@/lib/validations/kyc";

type PersonalValues = z.infer<typeof kycPersonalSchema>;
type AddressValues = z.infer<typeof kycAddressSchema>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-2 text-sm text-rose-600">{message}</p>;
}

function TextInput({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <input
        {...props}
        className="h-12 w-full rounded-md border border-banking-border px-4 outline-none focus:border-banking-blue"
      />
      <FieldError message={error} />
    </label>
  );
}

export function KycPersonalForm() {
  const { notify } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalValues>({
    resolver: zodResolver(kycPersonalSchema),
  });

  function onSubmit(values: PersonalValues) {
    console.log("KYC personal ready", values);
    notify({
      title: "Personal details saved",
      description: "Continue to address information.",
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput label="Full legal name" {...register("legalName")} error={errors.legalName?.message} />
        <TextInput label="Date of birth" type="date" {...register("dateOfBirth")} error={errors.dateOfBirth?.message} />
        <TextInput label="Nationality" {...register("nationality")} error={errors.nationality?.message} />
        <TextInput label="Occupation" {...register("occupation")} error={errors.occupation?.message} />
        <TextInput label="Source of funds" {...register("sourceOfFunds")} error={errors.sourceOfFunds?.message} />
        <TextInput label="Expected monthly activity" {...register("expectedMonthlyActivity")} error={errors.expectedMonthlyActivity?.message} />
      </div>
      <div className="flex flex-wrap gap-3">
        <button className="rounded-md bg-banking-blue px-4 py-3 text-sm font-semibold text-white">
          Save personal details
        </button>
        <Link href="/kyc/address" className="rounded-md border border-banking-border bg-white px-4 py-3 text-sm font-semibold">
          Continue
        </Link>
      </div>
    </form>
  );
}

export function KycAddressForm() {
  const { notify } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressValues>({
    resolver: zodResolver(kycAddressSchema),
  });

  function onSubmit(values: AddressValues) {
    console.log("KYC address ready", values);
    notify({
      title: "Address details saved",
      description: "Continue to document upload.",
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput label="Street address" {...register("street")} error={errors.street?.message} />
        <TextInput label="City" {...register("city")} error={errors.city?.message} />
        <TextInput label="Province / State" {...register("province")} error={errors.province?.message} />
        <TextInput label="Country" {...register("country")} error={errors.country?.message} />
        <TextInput label="Postal code" {...register("postalCode")} error={errors.postalCode?.message} />
        <TextInput label="Phone number" {...register("phone")} error={errors.phone?.message} />
      </div>
      <div className="flex flex-wrap gap-3">
        <button className="rounded-md bg-banking-blue px-4 py-3 text-sm font-semibold text-white">
          Save address
        </button>
        <Link href="/kyc/documents" className="rounded-md border border-banking-border bg-white px-4 py-3 text-sm font-semibold">
          Continue
        </Link>
      </div>
    </form>
  );
}
