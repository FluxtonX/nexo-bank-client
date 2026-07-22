"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/toast";
import { withdrawalSchema } from "@/lib/validations/financial";

type WithdrawalInput = z.input<typeof withdrawalSchema>;
type WithdrawalValues = z.output<typeof withdrawalSchema>;

export function WithdrawalForm() {
  const { notify } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WithdrawalInput, unknown, WithdrawalValues>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: 2500,
      interacEmail: "",
      note: "",
    },
  });

  function onSubmit(values: WithdrawalValues) {
    console.log("Withdrawal request ready for 2FA", values);
    notify({
      title: "Withdrawal request validated",
      description: "Next step would require 2FA confirmation.",
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <label className="block">
        <span className="mb-2 block text-sm font-medium">Amount</span>
        <input
          {...register("amount")}
          className="h-12 w-full rounded-md border border-banking-border px-4 outline-none focus:border-banking-blue"
          placeholder="$2,500.00"
        />
        {errors.amount ? (
          <p className="mt-2 text-sm text-rose-600">{errors.amount.message}</p>
        ) : null}
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-medium">Interac email</span>
        <input
          {...register("interacEmail")}
          className="h-12 w-full rounded-md border border-banking-border px-4 outline-none focus:border-banking-blue"
          placeholder="name@example.com"
        />
        {errors.interacEmail ? (
          <p className="mt-2 text-sm text-rose-600">
            {errors.interacEmail.message}
          </p>
        ) : null}
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-medium">Optional note</span>
        <textarea
          {...register("note")}
          className="min-h-28 w-full rounded-md border border-banking-border px-4 py-3 outline-none focus:border-banking-blue"
          placeholder="Add details for finance review"
        />
        {errors.note ? (
          <p className="mt-2 text-sm text-rose-600">{errors.note.message}</p>
        ) : null}
      </label>
      <button
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-banking-blue px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
      >
        <ShieldCheck className="h-4 w-4" />
        Continue to 2FA
      </button>
    </form>
  );
}
