import Stripe from "stripe";
import { requireEnv } from "@/lib/env";

let client: Stripe | null = null;

// Lazily construct the Stripe client so the app builds without the secret set.
export function getStripe(): Stripe {
  if (!client) {
    client = new Stripe(requireEnv("STRIPE_SECRET_KEY"), {
      apiVersion: "2024-06-20",
      typescript: true,
    });
  }
  return client;
}
