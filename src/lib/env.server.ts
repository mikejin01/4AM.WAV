import "server-only";
import { z } from "zod";

const envSchema = z.object({
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().optional().default(""),
  STRIPE_VIP_PRICE_ID: z.string().min(1),
});

export const serverEnv = envSchema.parse({
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  STRIPE_VIP_PRICE_ID: process.env.STRIPE_VIP_PRICE_ID,
});
