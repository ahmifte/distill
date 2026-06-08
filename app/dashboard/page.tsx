import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPlan } from "@/lib/pricing";
import { getUsage } from "@/lib/usage";
import { Summarizer } from "@/components/summarizer";
import { AccountActions } from "@/components/account-actions";

export const metadata: Metadata = { title: "Dashboard" };

// Reads the session (cookies), so this route is always dynamic — never prerendered.
export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  const plan = getPlan(user?.plan);
  const used = await getUsage(session.user.id);

  return (
    <section className="container py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted">
            {session.user.email} · {plan.name} plan
          </p>
        </div>
        <a
          href="/pricing"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-fg hover:opacity-90"
        >
          Manage plan
        </a>
      </div>

      <div className="mb-8 rounded-xl border border-default bg-card p-6">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Monthly usage</span>
          <span className="text-muted">
            {used} / {plan.monthlyLimit}
          </span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[hsl(var(--border))]">
          <div
            className="h-full bg-accent"
            style={{
              width: `${Math.min(100, (used / plan.monthlyLimit) * 100)}%`,
            }}
          />
        </div>
      </div>

      <Summarizer used={used} limit={plan.monthlyLimit} />

      <div className="mt-12 border-t border-default pt-8">
        <h2 className="mb-4 text-sm font-medium text-muted">Account</h2>
        <AccountActions />
      </div>
    </section>
  );
}
