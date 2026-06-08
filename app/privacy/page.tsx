import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How distill handles your data.",
};

export default function PrivacyPage() {
  return (
    <section className="container max-w-2xl py-20">
      <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted">Last updated: 2026</p>
      <div className="mt-8 space-y-6 leading-relaxed text-muted">
        <p>
          distill collects the minimum data needed to run the service: your
          account identity (via your chosen sign-in provider), your billing
          status (managed by Stripe), and the documents you choose to summarize.
        </p>
        <div>
          <h2 className="font-semibold text-[hsl(var(--foreground))]">
            Document processing
          </h2>
          <p className="mt-2">
            Documents you submit are sent to our model provider to generate a
            summary and stored in your account so you can revisit them. They are
            never used to train models. You can delete them — and your entire
            account — at any time from the dashboard.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-[hsl(var(--foreground))]">
            Your rights
          </h2>
          <p className="mt-2">
            You can export or delete your data and close your account at any
            time. We do not sell personal data. For requests, use the account
            controls in the dashboard or contact support.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-[hsl(var(--foreground))]">
            Payments
          </h2>
          <p className="mt-2">
            Card data is handled entirely by Stripe. distill never sees or stores
            your card number.
          </p>
        </div>
      </div>
    </section>
  );
}
