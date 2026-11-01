import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";
import { safeNextPath } from "@/lib/redirect";

export const metadata: Metadata = { title: "Sign in" };

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; reason?: string }>;
}) {
  const { next, reason } = await searchParams;
  return (
    <AuthForm
      mode="signin"
      next={safeNextPath(next)}
      notice={
        reason === "checkout"
          ? "Sign in to place your order. Your cart is saved."
          : undefined
      }
    />
  );
}
