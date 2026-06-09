"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  signInSchema,
  signUpSchema,
  type SignInValues,
  type SignUpValues,
} from "@/lib/validation";
import { registerUser } from "@/app/actions/auth";
import { mergeGuestCartAction } from "@/app/actions/cart";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type Mode = "signin" | "signup";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-ink-900">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
    </label>
  );
}

export function AuthForm({ mode }: { mode: Mode }) {
  const isSignUp = mode === "signup";
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<SignUpValues | SignInValues>({
    resolver: zodResolver(isSignUp ? signUpSchema : signInSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    if (isSignUp) {
      const result = await registerUser(values);
      if (!result.ok) {
        setFormError(result.error);
        return;
      }
    }

    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (res?.error) {
      setFormError("Invalid email or password");
      return;
    }

    // Fold any guest cart into the now-authenticated user's cart.
    await mergeGuestCartAction();

    router.push("/account");
    router.refresh();
  });

  const e = errors as Record<string, { message?: string } | undefined>;

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-6 text-heading font-black text-ink-900">
        {isSignUp ? "Create account" : "Sign in"}
      </h1>

      {formError && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {formError}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {isSignUp && (
          <Field label="Name" error={e.name?.message}>
            <Input type="text" autoComplete="name" {...register("name")} />
          </Field>
        )}
        <Field label="Email" error={e.email?.message}>
          <Input type="email" autoComplete="email" {...register("email")} />
        </Field>
        <Field label="Password" error={e.password?.message}>
          <Input
            type="password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            {...register("password")}
          />
        </Field>
        {isSignUp && (
          <Field label="Confirm password" error={e.confirmPassword?.message}>
            <Input
              type="password"
              autoComplete="new-password"
              {...register("confirmPassword")}
            />
          </Field>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting
            ? "Please wait…"
            : isSignUp
              ? "Create account"
              : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-gray-500">
        {isSignUp ? "Already have an account? " : "No account yet? "}
        <Link
          href={isSignUp ? "/signin" : "/signup"}
          className="font-bold text-ink-900 underline"
        >
          {isSignUp ? "Sign in" : "Create one"}
        </Link>
      </p>
    </div>
  );
}
