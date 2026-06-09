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
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
