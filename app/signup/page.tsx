import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";
import { safeNextPath } from "@/lib/redirect";

export const metadata: Metadata = { title: "Create account" };

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; reason?: string }>;
}) {
  const { next, reason } = await searchParams;
  return (
    <AuthForm
      mode="signup"
      next={safeNextPath(next)}
      notice={
        reason === "checkout"
          ? "Create an account to place your order. Your cart is saved."
          : undefined
      }
    />
  );
}
