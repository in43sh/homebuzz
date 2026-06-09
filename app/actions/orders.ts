"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { placeOrder } from "@/lib/orders";

export async function placeOrderAction() {
  const result = await placeOrder();

  if (!result.ok) {
    redirect(result.reason === "unauthenticated" ? "/signin" : "/cart");
  }

  revalidatePath("/", "layout");
  redirect(`/account/orders/${result.id}`);
}
