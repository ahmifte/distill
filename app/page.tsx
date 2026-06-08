import Link from "next/link";
import { ArrowRight, FileText, Gauge, Lock } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <section className="container py-24 text-center sm:py-32">
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          Turn long documents into clear summaries in seconds
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
          distill is a production-ready AI summarization SaaS — and an
          open-source boilerplate you can fork. Auth, subscriptions, usage
          metering, and the AI feature are all wired up.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 font-medium text-accent-fg hover:opacity-90"
          >
            Start free <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center rounded-md border border-default px-5 py-3 font-medium"
          >
            View pricing
          </Link>
        </div>
      </section>

      <section className="container grid gap-6 pb-24 md:grid-cols-3">
        {[
          {
            icon: FileText,
            title: "Faithful summaries",
            body: "A TL;DR plus key bullet points, grounded in your text — no hallucinated details.",
          },
          {
            icon: Gauge,
            title: "Usage metering",
            body: "Per-plan monthly limits enforced server-side, with upgrade prompts at the edge.",
          },
          {
            icon: Lock,
            title: "Secure by default",
            body: "NextAuth sessions, Stripe-managed billing, and validated environment config.",
          },
        ].map((feature) => (
          <div
            key={feature.title}
            className="rounded-xl border border-default bg-card p-6"
          >
            <feature.icon className="h-6 w-6 text-accent" />
            <h2 className="mt-4 text-lg font-semibold">{feature.title}</h2>
            <p className="mt-2 text-sm text-muted">{feature.body}</p>
          </div>
        ))}
      </section>
    </>
  );
}
