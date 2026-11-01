"use client";

import { Button } from "@/components/ui/Button";

// Catches errors thrown while rendering a page or running a Server Action, for
// example a failed checkout. `unstable_retry` re-fetches and re-renders the
// route (the Next.js 16 replacement for `reset` in most cases).
export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <div role="alert" className="mx-auto max-w-7xl px-4 py-20 text-center">
      <h1 className="mb-4 text-heading font-black text-ink-900">
        Something went wrong
      </h1>
      <p className="mb-2 text-slate-700">
        We couldn&apos;t finish that. Please try again.
      </p>
      {error.digest && (
        <p className="mb-8 text-xs text-gray-500">Reference: {error.digest}</p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={() => unstable_retry()}>Try again</Button>
        <Button href="/" variant="outline">
          Back to home
        </Button>
      </div>
    </div>
  );
}
