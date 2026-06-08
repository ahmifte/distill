import Stripe from "stripe";
import { billablePlans, type BillablePlan } from "../lib/pricing";

// Idempotent provisioning: makes the connected Stripe account match the plan
// catalog in lib/pricing.ts. Run with `pnpm stripe:sync`. The account targeted
// is whatever STRIPE_SECRET_KEY belongs to — run it with your personal key and
// everything is created in your personal account.

type Result = "created" | "updated" | "unchanged";

async function ensureProduct(
  stripe: Stripe,
  id: string,
  name: string,
): Promise<void> {
  try {
    await stripe.products.retrieve(id);
    await stripe.products.update(id, { name, active: true });
  } catch (err) {
    if (err instanceof Stripe.errors.StripeInvalidRequestError && err.code === "resource_missing") {
      await stripe.products.create({ id, name, metadata: { app_key: id } });
      return;
    }
    throw err;
  }
}

async function syncPlan(stripe: Stripe, plan: BillablePlan): Promise<Result> {
  const productId = `distill_${plan.id}`;
  await ensureProduct(stripe, productId, `distill ${plan.name}`);

  const { data } = await stripe.prices.list({
    lookup_keys: [plan.lookupKey],
    active: true,
    limit: 1,
  });
  const existing = data[0];

  const matches =
    existing &&
    existing.unit_amount === plan.amount &&
    existing.currency === plan.currency &&
    existing.recurring?.interval === plan.interval;

  if (matches) return "unchanged";

  // Prices are immutable: create a new one, move the lookup_key onto it, and
  // archive the previous price so checkout only ever finds the current one.
  await stripe.prices.create({
    product: productId,
    unit_amount: plan.amount,
    currency: plan.currency,
    recurring: { interval: plan.interval },
    lookup_key: plan.lookupKey,
    transfer_lookup_key: true,
  });
  if (existing) {
    await stripe.prices.update(existing.id, { active: false });
    return "updated";
  }
  return "created";
}

async function main(): Promise<void> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    console.error(
      "Missing STRIPE_SECRET_KEY. Set it in .env.local (the script is run with --env-file=.env.local).",
    );
    process.exit(1);
  }

  const stripe = new Stripe(key, { apiVersion: "2024-06-20" });
  const plans = billablePlans();

  console.log(`Syncing ${plans.length} plan(s) to Stripe...`);
  for (const plan of plans) {
    const result = await syncPlan(stripe, plan);
    console.log(`  ${plan.lookupKey}: ${result}`);
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
