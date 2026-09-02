import { z } from "zod";

export const withdrawalSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  interacEmail: z.string().email("Enter a valid Interac email"),
  note: z.string().max(240, "Note must be under 240 characters").optional(),
});

export const priceAlertSchema = z.object({
  asset: z.enum(["BTC", "ETH", "USDT"]),
  type: z.enum(["price_above", "price_below", "percentage_change"]),
  target: z.coerce.number().positive("Target must be greater than zero"),
});
