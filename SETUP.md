# Setup — first run

## 1. Prerequisites

- Node 20+
- A [Neon](https://neon.com) Postgres database (free tier works)

## 2. Environment

Copy the example and fill in values:

```bash
cp .env.example .env.local
```

> **Important:** the file must be named `.env.local`, not `.env`. The
> `drizzle.config.ts` and the `db:seed` script both load `.env.local`.

| Var                     | Where to get it                                                                 |
| ----------------------- | ------------------------------------------------------------------------------- |
| `DATABASE_URL`          | Neon dashboard → Connection Details → **pooling ON** (host contains `-pooler`). |
| `DATABASE_URL_UNPOOLED` | Same screen → **pooling OFF** (direct host, no `-pooler`). Used for migrations. |
| `AUTH_SECRET`           | Generate with `npx auth secret`.                                                |

Why two URLs: the app runs through Neon's transaction-mode pooler
(`prepare: false` in `db/index.ts`), but `drizzle-kit` migrations need a
direct connection — DDL and prepared statements don't work through the pooler.

## 3. Install deps

```bash
npm install
```

## 4. Create tables + seed data

```bash
npm run db:migrate   # apply migrations (creates all tables)
npm run db:seed      # 2 users, 15 categories, 12 products
```

> Do **not** use `npm run db:push` in scripts/CI — it needs an interactive TTY
> to confirm. Use `db:migrate`, or run `db:push` in a real terminal.

Seeded logins (password for both: `password1234`):

- `demo@homebuzz.test` — customer
- `admin@homebuzz.test` — admin

## 5. Run

```bash
npm run dev
```

Open <http://localhost:3000>.

## Other commands

| Command               | Purpose                              |
| --------------------- | ------------------------------------ |
| `npm run db:generate` | Generate a migration from schema     |
| `npm run db:studio`   | Drizzle Studio (browse the DB)       |
| `npm test`            | Vitest unit tests                    |
| `npm run test:e2e`    | Playwright E2E tests                 |

## Troubleshooting

- **`relation "products" does not exist`** → tables not created. Run
  `npm run db:migrate`, then `npm run db:seed`.
- **`DATABASE_URL is not set`** → env file is `.env`, not `.env.local`. Rename it.
- **Interactive prompt error on `db:push`** → use `npm run db:migrate` instead.
