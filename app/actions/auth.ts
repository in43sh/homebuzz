"use server";

import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { signUpSchema } from "@/lib/validation";

export type RegisterResult = { ok: true } | { ok: false; error: string };

export async function registerUser(values: unknown): Promise<RegisterResult> {
  const parsed = signUpSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: "Invalid input" };
  }
  const { name, email, password } = parsed.data;

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing) {
    return { ok: false, error: "An account with that email already exists" };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await db.insert(users).values({ name, email, passwordHash });

  return { ok: true };
}
