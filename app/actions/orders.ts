"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { placeOrder } from "@/lib/orders";
import { authHref } from "@/lib/redirect";

export async function placeOrderAction() {
  const result = await placeOrder();

  if (!result.ok) {
    // Explain why, and bring the shopper back to their cart after signing in.
    if (result.reason === "unauthenticated") {
      redirect(authHref("/signin", "/cart", "checkout"));
    }
    // Out of stock (or empty): the cart page flags the exact lines from live stock.
    redirect("/cart");
  }

  // Stock changed — refresh the cart count and any cached catalog views.
  revalidatePath("/", "layout");
  revalidatePath("/store");
  redirect(`/account/orders/${result.id}`);
}
