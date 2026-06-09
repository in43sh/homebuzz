"use server";

import { revalidatePath } from "next/cache";
import * as cart from "@/lib/cart";

async function revalidate() {
  // Header (in the root layout) shows the cart count, so revalidate the tree.
  revalidatePath("/", "layout");
}

export async function addToCartAction(productId: string, quantity = 1) {
  await cart.addItem(Number(productId), quantity);
  await revalidate();
}

export async function setQtyAction(productId: string, quantity: number) {
  await cart.setItemQuantity(Number(productId), quantity);
  await revalidate();
}

export async function removeItemAction(productId: string) {
  await cart.removeItem(Number(productId));
  await revalidate();
}

export async function clearCartAction() {
  await cart.clearCart();
  await revalidate();
}

export async function mergeGuestCartAction() {
  await cart.mergeGuestCartIntoUser();
  await revalidate();
}
