import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

// Reuse a single client across hot reloads in dev.
const globalForDb = globalThis as unknown as {
  client?: ReturnType<typeof postgres>;
};

// Neon's pooled endpoint runs PgBouncer in transaction mode, which does not
// support prepared statements — disable them. `max` stays low since the pooler
// fans out to Postgres.
const client =
  globalForDb.client ?? postgres(connectionString, { max: 5, prepare: false });
if (process.env.NODE_ENV !== "production") globalForDb.client = client;

export const db = drizzle(client, { schema });
export { schema };
