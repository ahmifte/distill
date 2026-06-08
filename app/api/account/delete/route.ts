import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { env } from "@/lib/env";

// GDPR/CCPA: let a user delete their account and all associated data.
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  // Best-effort cancellation of any active subscription before deletion.
  if (user?.stripeSubscriptionId && env.STRIPE_SECRET_KEY) {
    try {
      await getStripe().subscriptions.cancel(user.stripeSubscriptionId);
    } catch (err) {
      console.error("Failed to cancel subscription during deletion:", err);
    }
  }

  // Cascading relations (sessions, accounts, usage, documents) are removed via
  // onDelete: Cascade in the Prisma schema.
  await prisma.user.delete({ where: { id: session.user.id } });

  return NextResponse.json({ deleted: true });
}
