"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { productSchema } from "@/lib/validation";
import {
  isAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/admin";

export type SaveResult = { ok: false; error: string } | void;

function revalidateCatalog() {
  revalidatePath("/admin/products");
  revalidatePath("/store");
  revalidatePath("/");
}

export async function saveProductAction(
  id: number | null,
  values: unknown,
): Promise<SaveResult> {
  if (!(await isAdmin())) redirect("/");

  const parsed = productSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  if (id) {
    await updateProduct(id, parsed.data);
  } else {
    await createProduct(parsed.data);
  }

  revalidateCatalog();
  redirect("/admin/products");
}

export async function deleteProductAction(id: number): Promise<void> {
  if (!(await isAdmin())) redirect("/");
  await deleteProduct(id);
  revalidateCatalog();
}
