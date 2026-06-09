"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { submitReviewAction } from "@/app/actions/reviews";

export function ReviewForm({
  productId,
  slug,
}: {
  productId: number;
  slug: string;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="rounded-lg border border-gray-200 p-4"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
          const res = await submitReviewAction(productId, slug, { rating, body });
          if (!res.ok) {
            setError(res.error);
            return;
          }
          setDone(true);
          setBody("");
          router.refresh();
        });
      }}
    >
      <h3 className="mb-3 font-bold text-ink-900">Write a review</h3>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      {done && (
        <p className="mb-3 text-sm text-green-700">Thanks — review saved.</p>
      )}

      <label className="mb-3 block">
        <span className="mb-1 block text-sm font-bold text-ink-900">Rating</span>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="h-9 rounded-md border border-gray-200 bg-white px-3 text-sm"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} star{n === 1 ? "" : "s"}
            </option>
          ))}
        </select>
      </label>

      <label className="mb-3 block">
        <span className="mb-1 block text-sm font-bold text-ink-900">
          Review (optional)
        </span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          maxLength={1000}
          className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          placeholder="What did you think?"
        />
      </label>

      <Button type="submit" size="small" disabled={pending}>
        {pending ? "Saving…" : "Submit review"}
      </Button>
    </form>
  );
}
