import { defineConfig } from "drizzle-kit";

// Load local env for CLI runs (Next loads .env.local automatically at runtime).
try {
  process.loadEnvFile(".env.local");
} catch {
  // no local env file — rely on the ambient environment
}

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    // Migrations need a direct (non-pooled) connection — DDL + prepared
    // statements don't work through Neon's transaction-mode pooler.
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
