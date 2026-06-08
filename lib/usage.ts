import { prisma } from "@/lib/prisma";
import { getPlan } from "@/lib/pricing";

// Billing-period key in YYYY-MM (UTC).
export function currentPeriod(date = new Date()): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export async function getUsage(userId: string): Promise<number> {
  const period = currentPeriod();
  const row = await prisma.usage.findUnique({
    where: { userId_period: { userId, period } },
  });
  return row?.count ?? 0;
}

export type UsageStatus = {
  used: number;
  limit: number;
  remaining: number;
  plan: string;
};

export async function getUsageStatus(
  userId: string,
  plan: string,
): Promise<UsageStatus> {
  const used = await getUsage(userId);
  const limit = getPlan(plan).monthlyLimit;
  return { used, limit, remaining: Math.max(0, limit - used), plan };
}

// Atomically increment usage for the current period. Returns the new count.
export async function incrementUsage(userId: string): Promise<number> {
  const period = currentPeriod();
  const row = await prisma.usage.upsert({
    where: { userId_period: { userId, period } },
    create: { userId, period, count: 1 },
    update: { count: { increment: 1 } },
  });
  return row.count;
}
