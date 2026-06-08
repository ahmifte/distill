import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { summarize } from "@/lib/openai";
import { getUsage, incrementUsage } from "@/lib/usage";
import { getPlan } from "@/lib/pricing";

const schema = z.object({
  title: z.string().max(200).optional().default("Untitled"),
  text: z.string().min(1).max(50_000),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const userId = session.user.id;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }

  // Enforce the monthly limit for the user's current plan before spending tokens.
  const plan = getPlan(user.plan);
  const used = await getUsage(userId);
  if (used >= plan.monthlyLimit) {
    return NextResponse.json(
      {
        error: "Monthly limit reached for your plan. Upgrade to continue.",
        code: "limit_reached",
      },
      { status: 402 },
    );
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 422 });
  }

  let summary: string;
  try {
    summary = await summarize(parsed.data.text);
  } catch (err) {
    console.error("Summarize failed:", err);
    return NextResponse.json(
      { error: "The summarization request failed. Try again later." },
      { status: 502 },
    );
  }

  // Free tier output is watermarked; this is part of the upgrade incentive.
  const finalSummary =
    user.plan === "free"
      ? `${summary}\n\n— Summarized with distill (free tier)`
      : summary;

  await prisma.document.create({
    data: { userId, title: parsed.data.title, summary: finalSummary },
  });
  const newCount = await incrementUsage(userId);

  return NextResponse.json({ summary: finalSummary, used: newCount });
}
