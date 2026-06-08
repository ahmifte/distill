import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing your use of distill.",
};

export default function TermsPage() {
  return (
    <section className="container max-w-2xl py-20">
      <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted">Last updated: 2026</p>
      <div className="mt-8 space-y-6 leading-relaxed text-muted">
        <div>
          <h2 className="font-semibold text-[hsl(var(--foreground))]">
            Use of the service
          </h2>
          <p className="mt-2">
            You may use distill to summarize content you own or have the right to
            process. You are responsible for the content you submit and for
            complying with applicable laws.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-[hsl(var(--foreground))]">
            Subscriptions
          </h2>
          <p className="mt-2">
            Paid plans renew automatically until cancelled. You can cancel at any
            time; access continues until the end of the current billing period.
            Usage limits reset monthly.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-[hsl(var(--foreground))]">
            Refunds
          </h2>
          <p className="mt-2">
            If distill is not working as described, contact support within 14
            days of a charge and we will make it right.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-[hsl(var(--foreground))]">
            Disclaimer
          </h2>
          <p className="mt-2">
            AI-generated summaries may contain errors. distill is provided on an
            as-is basis without warranties, and liability is limited to the
            amount you paid in the prior month.
          </p>
        </div>
      </div>
    </section>
  );
}
