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
import { authHref } from "@/lib/redirect";

type Mode = "signin" | "signup";

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  /** Field name; the error element's id is `${id}-error`. */
  id: string;
  label: string;
  error?: string;
  /** A requirement shown before the user submits, so it is never a surprise. */
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-ink-900">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
      {error && (
        <span
          id={`${id}-error`}
          role="alert"
          className="mt-1 block text-sm text-red-600"
        >
          {error}
        </span>
      )}
    </label>
  );
}

export function AuthForm({
  mode,
  next = null,
  notice,
}: {
  mode: Mode;
  /** Where to go after signing in (already validated by the page). */
  next?: string | null;
  /** Why the user is here, for example when checkout needs an account. */
  notice?: string;
}) {
  const isSignUp = mode === "signup";
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<SignUpValues | SignInValues>({
    resolver: zodResolver(isSignUp ? signUpSchema : signInSchema),
  });
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    if (isSignUp) {
      const result = await registerUser(values);
      if (!result.ok) {
        setFormError(result.error);
        setFocus("email");
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
      setFocus("password"); // keep keyboard users in the form, ready to retry
      return;
    }

    // Fold any guest cart into the now-authenticated user's cart.
    await mergeGuestCartAction();

    router.push(next ?? "/account");
    router.refresh();
  });

  const e = errors as Record<string, { message?: string } | undefined>;

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-6 text-heading font-black text-ink-900">
        {isSignUp ? "Create account" : "Sign in"}
      </h1>

      {notice && (
        <p
          role="status"
          className="mb-4 rounded-md border border-gray-200 bg-gray-200/50 p-3 text-sm text-ink-900"
        >
          {notice}
        </p>
      )}

      {formError && (
        <div
          role="alert"
          className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {formError}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {isSignUp && (
          <Field id="name" label="Name" error={e.name?.message}>
            <Input
              type="text"
              autoComplete="name"
              aria-invalid={!!e.name}
              aria-describedby={e.name ? "name-error" : undefined}
              {...register("name")}
            />
          </Field>
        )}
        <Field id="email" label="Email" error={e.email?.message}>
          <Input
            type="email"
            autoComplete="email"
            aria-invalid={!!e.email}
            aria-describedby={e.email ? "email-error" : undefined}
            {...register("email")}
          />
        </Field>
        <Field
          id="password"
          label="Password"
          error={e.password?.message}
          hint={isSignUp ? "At least 8 characters." : undefined}
        >
          <Input
            type="password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            aria-invalid={!!e.password}
            aria-describedby={e.password ? "password-error" : undefined}
            {...register("password")}
          />
        </Field>
        {isSignUp && (
          <Field
            id="confirmPassword"
            label="Confirm password"
            error={e.confirmPassword?.message}
          >
            <Input
              type="password"
              autoComplete="new-password"
              aria-invalid={!!e.confirmPassword}
              aria-describedby={
                e.confirmPassword ? "confirmPassword-error" : undefined
              }
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
          href={authHref(isSignUp ? "/signin" : "/signup", next, notice ? "checkout" : undefined)}
          className="font-bold text-ink-900 underline"
        >
          {isSignUp ? "Sign in" : "Create one"}
        </Link>
      </p>
    </div>
  );
}
