import { env } from "@/lib/env";

// Single source of truth for plans. Limits are enforced in lib/usage.ts and the
// Stripe price IDs are read from the environment so they differ per deployment.
export type PlanId = "free" | "pro" | "team";

export type Plan = {
  id: PlanId;
  name: string;
  priceLabel: string;
  monthlyLimit: number;
  seats: number;
  features: string[];
  stripePriceId?: string;
};

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Free",
    priceLabel: "$0",
    monthlyLimit: 5,
    seats: 1,
    features: ["5 documents / month", "Watermarked output", "Community support"],
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceLabel: "$19/mo",
    monthlyLimit: 200,
    seats: 1,
    features: ["200 documents / month", "No watermark", "Priority model"],
    stripePriceId: env.STRIPE_PRICE_PRO,
  },
  team: {
    id: "team",
    name: "Team",
    priceLabel: "$49/mo",
    monthlyLimit: 1000,
    seats: 3,
    features: ["1,000 documents / month", "3 seats", "API access"],
    stripePriceId: env.STRIPE_PRICE_TEAM,
  },
};

export function getPlan(planId: string | null | undefined): Plan {
  if (planId === "pro" || planId === "team") return PLANS[planId];
  return PLANS.free;
}
