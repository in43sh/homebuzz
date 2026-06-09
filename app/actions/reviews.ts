"use server";

import { revalidatePath } from "next/cache";
import { reviewSchema } from "@/lib/validation";
import { upsertReview } from "@/lib/reviews";

export type ReviewResult = { ok: true } | { ok: false; error: string };

export async function submitReviewAction(
  productId: number,
  slug: string,
  values: unknown,
): Promise<ReviewResult> {
  const parsed = reviewSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: "Please pick a rating from 1 to 5" };
  }

  const result = await upsertReview(
    productId,
    parsed.data.rating,
    parsed.data.body ?? "",
  );
  if (!result.ok) {
    return {
      ok: false,
      error:
        result.reason === "not_purchased"
          ? "You can only review products you've ordered"
          : "You must be signed in to review",
    };
  }

  revalidatePath(`/product/${slug}`);
  return { ok: true };
}
