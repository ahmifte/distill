# Contributing

Contributions are welcome.

## Getting set up

```bash
pnpm install
cp .env.example .env.local
pnpm db:push
pnpm dev
```

## Before opening a pull request

- Run `pnpm lint` and `pnpm typecheck` (the Prisma client is generated on install).
- Keep pull requests focused on a single change.
- Open an issue first for larger features so we can align on the approach.

## Database changes

Edit `prisma/schema.prisma`, then run `pnpm db:push` locally. Describe any schema change clearly in your pull request.
