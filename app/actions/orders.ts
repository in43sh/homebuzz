"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { placeOrder } from "@/lib/orders";
import { authHref } from "@/lib/redirect";
import { checkoutSchema } from "@/lib/validation";

export type PlaceOrderResult = {
  ok: false;
  /** Field name to message, for errors the browser could not catch. */
  fieldErrors: Record<string, string>;
};

/**
 * Validate the checkout form again on the server (the browser check can be
 * bypassed), then place the order. On success this redirects, so it only ever
 * returns when the form is invalid.
 */
export async function placeOrderAction(
  values: unknown,
): Promise<PlaceOrderResult> {
  const parsed = checkoutSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return { ok: false, fieldErrors };
  }

  const result = await placeOrder(parsed.data);

  if (!result.ok) {
    // Explain why, and bring the shopper back to checkout after signing in.
    if (result.reason === "unauthenticated") {
      redirect(authHref("/signin", "/checkout", "checkout"));
    }
    // Out of stock (or empty): the cart page flags the exact lines from live stock.
    redirect("/cart");
  }

  // Stock changed — refresh the cart count and any cached catalog views.
  revalidatePath("/", "layout");
  revalidatePath("/store");
  redirect(`/account/orders/${result.id}?placed=1`);
}
