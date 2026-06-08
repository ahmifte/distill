# distill

[![CI](https://github.com/ahmifte/distill/actions/workflows/ci.yml/badge.svg)](https://github.com/ahmifte/distill/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Built with Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)

A production-ready, open-source **AI SaaS boilerplate** built around a real product: an AI document summarizer. Auth, subscriptions, usage metering, and the AI feature are all wired up so you can fork it and ship your own SaaS.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ahmifte/distill)

## Why this project?

Most "SaaS starters" stop at a login page. distill is end-to-end: GitHub auth via NextAuth, Stripe subscription checkout and webhooks, per-plan usage limits enforced server-side, a working OpenAI feature, and GDPR-friendly account deletion. It is the boilerplate that would have saved you weeks.

## Stack

- **Next.js 14** App Router + TypeScript
- **NextAuth** (database sessions, Prisma adapter)
- **Prisma** + PostgreSQL
- **Stripe** subscriptions (Checkout + webhooks)
- **OpenAI** for summarization
- **Tailwind CSS**

## Features

- Marketing landing + usage-based pricing page
- GitHub sign-in
- Dashboard with live monthly usage meter
- Server-side plan limits with upgrade prompts (`free` / `pro` / `team`)
- Stripe Checkout and a webhook that keeps plan state in sync
- Account + data deletion endpoint (privacy compliance)
- Centralized, validated env config in [`lib/env.ts`](lib/env.ts)
- Single pricing source of truth in [`lib/pricing.ts`](lib/pricing.ts)

## Getting started

```bash
pnpm install                 # runs `prisma generate`
cp .env.example .env.local   # fill in DATABASE_URL, auth, OpenAI, Stripe
pnpm db:push                 # create the schema in your database
pnpm dev
```

### Required setup

1. **Database** — any PostgreSQL URL (Neon/Supabase/local).
2. **GitHub OAuth app** — set `GITHUB_ID` / `GITHUB_SECRET`.
3. **OpenAI** — set `OPENAI_API_KEY`.
4. **Stripe** — set `STRIPE_SECRET_KEY` (prefer a restricted key, `rk_...`) and point a webhook at `/api/stripe/webhook` with `STRIPE_WEBHOOK_SECRET`. You never paste price IDs — see below.

All variables are documented in [`.env.example`](.env.example).

### Stripe products & prices (code as source of truth)

Plans are defined in code in [`lib/pricing.ts`](lib/pricing.ts) — name, amount, and a stable `lookupKey`. To provision them in Stripe, run:

```bash
pnpm stripe:sync
```

This idempotently creates/updates the Products and Prices in whatever account `STRIPE_SECRET_KEY` belongs to (so run it with **your** key), tagging each price with its `lookupKey`. At runtime the app resolves the live price ID by `lookupKey` via [`lib/stripe-prices.ts`](lib/stripe-prices.ts) — no price IDs in env or code. Changing a price is just editing `lib/pricing.ts` and re-running the sync.

## Monetization

Recurring subscriptions. Pick an ultra-narrow niche (e.g. "summarize leases for realtors") and the free tier becomes your funnel. Pricing lives in [`lib/pricing.ts`](lib/pricing.ts).

## Scripts

- `pnpm dev` / `pnpm build` / `pnpm start`
- `pnpm lint` / `pnpm typecheck`
- `pnpm db:push` — push the Prisma schema
- `pnpm stripe:sync` — provision Stripe products/prices from `lib/pricing.ts`

## License

MIT — see [LICENSE](./LICENSE).
