// Single source of truth for plans. Limits are enforced in lib/usage.ts. The
// paid plans define their Stripe price by amount + a stable `lookupKey`; the
// actual price object is provisioned by `pnpm stripe:sync` and resolved at
// runtime via lib/stripe-prices.ts — no price IDs live in code or env.
export type PlanId = "free" | "pro" | "team";

export type Plan = {
  id: PlanId;
  name: string;
  priceLabel: string;
  monthlyLimit: number;
  seats: number;
  features: string[];
  // Billing details for paid plans (absent on the free plan).
  lookupKey?: string;
  amount?: number; // in the currency's smallest unit (cents)
  currency?: string;
  interval?: "month" | "year";
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
    lookupKey: "distill_pro_monthly",
    amount: 1900,
    currency: "usd",
    interval: "month",
  },
  team: {
    id: "team",
    name: "Team",
    priceLabel: "$49/mo",
    monthlyLimit: 1000,
    seats: 3,
    features: ["1,000 documents / month", "3 seats", "API access"],
    lookupKey: "distill_team_monthly",
    amount: 4900,
    currency: "usd",
    interval: "month",
  },
};

export function getPlan(planId: string | null | undefined): Plan {
  if (planId === "pro" || planId === "team") return PLANS[planId];
  return PLANS.free;
}

// Map a Stripe price lookup_key back to our internal plan id.
export function planIdForLookupKey(
  lookupKey: string | null | undefined,
): PlanId {
  if (!lookupKey) return "free";
  const match = (Object.values(PLANS) as Plan[]).find(
    (plan) => plan.lookupKey === lookupKey,
  );
  return match?.id ?? "free";
}

export type BillablePlan = Plan & {
  lookupKey: string;
  amount: number;
  currency: string;
  interval: "month" | "year";
};

// All plans that should be provisioned in Stripe (i.e. have billing details).
export function billablePlans(): BillablePlan[] {
  return (Object.values(PLANS) as Plan[]).filter(
    (plan): plan is BillablePlan =>
      Boolean(plan.lookupKey && plan.amount && plan.currency && plan.interval),
  );
}
