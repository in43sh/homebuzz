"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { placeOrder } from "@/lib/orders";

export async function placeOrderAction() {
  const result = await placeOrder();

  if (!result.ok) {
    if (result.reason === "unauthenticated") redirect("/signin");
    if (result.reason === "out_of_stock") redirect("/cart?error=stock");
    redirect("/cart");
  }

  // Stock changed — refresh the cart count and any cached catalog views.
  revalidatePath("/", "layout");
  revalidatePath("/store");
  redirect(`/account/orders/${result.id}`);
}
