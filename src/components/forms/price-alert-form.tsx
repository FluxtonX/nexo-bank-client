"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BellRing } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/toast";
import { priceAlertSchema } from "@/lib/validations/financial";

type PriceAlertInput = z.input<typeof priceAlertSchema>;
type PriceAlertValues = z.output<typeof priceAlertSchema>;

export function PriceAlertForm() {
  const { notify } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PriceAlertInput, unknown, PriceAlertValues>({
    resolver: zodResolver(priceAlertSchema),
    defaultValues: { asset: "BTC", type: "price_above", target: 75000 },
  });

  function onSubmit(values: PriceAlertValues) {
    console.log("Price alert ready", values);
    notify({
      title: "Price alert saved",
      description: `${values.asset} alert is active in the static UI.`,
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <label className="block">
        <span className="mb-2 block text-sm font-medium">Asset</span>
        <select {...register("asset")} className="h-12 w-full rounded-md border border-banking-border px-4">
          <option>BTC</option>
          <option>ETH</option>
          <option>USDT</option>
        </select>
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-medium">Alert type</span>
        <select {...register("type")} className="h-12 w-full rounded-md border border-banking-border px-4">
          <option value="price_above">price_above</option>
          <option value="price_below">price_below</option>
          <option value="percentage_change">percentage_change</option>
        </select>
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-medium">Target</span>
        <input {...register("target")} className="h-12 w-full rounded-md border border-banking-border px-4" placeholder="Target price" />
        {errors.target ? <p className="mt-2 text-sm text-rose-600">{errors.target.message}</p> : null}
      </label>
      <button className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-banking-blue px-4 py-3 text-sm font-semibold text-white">
        <BellRing className="h-4 w-4" />
        Save alert
      </button>
    </form>
  );
}
