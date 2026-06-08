import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { requireEnv } from "@/lib/env";
import { PLANS } from "@/lib/pricing";

// Stripe requires the raw request body to verify the signature.
export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      requireEnv("STRIPE_WEBHOOK_SECRET"),
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  // Map a Stripe price ID back to our internal plan id.
  function planForPrice(priceId: string | undefined): string {
    if (priceId && priceId === PLANS.team.stripePriceId) return "team";
    if (priceId && priceId === PLANS.pro.stripePriceId) return "pro";
    return "free";
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const sessionObj = event.data.object as Stripe.Checkout.Session;
        const userId = sessionObj.metadata?.userId;
        const subscriptionId = sessionObj.subscription as string | null;
        if (userId && subscriptionId) {
          const subscription =
            await stripe.subscriptions.retrieve(subscriptionId);
          const priceId = subscription.items.data[0]?.price.id;
          await prisma.user.update({
            where: { id: userId },
            data: {
              stripeSubscriptionId: subscription.id,
              plan: planForPrice(priceId),
              currentPeriodEnd: new Date(
                subscription.current_period_end * 1000,
              ),
            },
          });
        }
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const priceId = subscription.items.data[0]?.price.id;
        await prisma.user.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            plan:
              subscription.status === "active"
                ? planForPrice(priceId)
                : "free",
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        });
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await prisma.user.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: { plan: "free", stripeSubscriptionId: null },
        });
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Handler error." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
