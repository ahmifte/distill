import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { PLANS } from "@/lib/pricing";
import { env } from "@/lib/env";

const schema = z.object({ plan: z.enum(["pro", "team"]) });

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid plan." }, { status: 422 });
  }

  const plan = PLANS[parsed.data.plan];
  if (!plan.stripePriceId) {
    return NextResponse.json(
      { error: "This plan is not configured for checkout." },
      { status: 503 },
    );
  }

  const stripe = getStripe();
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  // Reuse an existing Stripe customer or create one keyed to the user.
  let customerId = user?.stripeCustomerId ?? undefined;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email,
      metadata: { userId: session.user.id },
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: session.user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: plan.stripePriceId, quantity: 1 }],
    success_url: `${env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=1`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata: { userId: session.user.id, plan: plan.id },
  });

  return NextResponse.json({ url: checkout.url });
}
