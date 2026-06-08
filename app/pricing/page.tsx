import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PLANS } from "@/lib/pricing";
import { UpgradeButton } from "@/components/upgrade-button";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, usage-based pricing for distill.",
};

export default function PricingPage() {
  const order = [PLANS.free, PLANS.pro, PLANS.team];

  return (
    <section className="container py-20">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Simple, usage-based pricing
        </h1>
        <p className="mt-2 text-muted">
          Start free. Upgrade when you need more documents. Cancel anytime.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
        {order.map((plan) => (
          <div
            key={plan.id}
            className={`flex flex-col rounded-xl border bg-card p-6 ${
              plan.id === "pro" ? "border-accent" : "border-default"
            }`}
          >
            <h2 className="text-lg font-semibold">{plan.name}</h2>
            <p className="mt-2 text-3xl font-bold">{plan.priceLabel}</p>
            <ul className="mt-6 flex-1 space-y-2 text-sm">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              {plan.id === "free" ? (
                <a
                  href="/dashboard"
                  className="inline-flex w-full items-center justify-center rounded-md border border-default px-4 py-2.5 text-sm font-medium"
                >
                  Get started
                </a>
              ) : (
                <UpgradeButton
                  plan={plan.id as "pro" | "team"}
                  label={`Upgrade to ${plan.name}`}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
