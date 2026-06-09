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

export type DeleteResult = { ok: true } | { ok: false; error: string };

export async function deleteProductAction(id: number): Promise<DeleteResult> {
  if (!(await isAdmin())) redirect("/");
  try {
    await deleteProduct(id);
  } catch (e) {
    // order_items.product_id is ON DELETE restrict — a product that's been
    // ordered can't be hard-deleted (SQLSTATE 23503).
    if (
      e &&
      typeof e === "object" &&
      "code" in e &&
      (e as { code?: string }).code === "23503"
    ) {
      return {
        ok: false,
        error: "This product has been ordered and can't be deleted.",
      };
    }
    throw e;
  }
  revalidateCatalog();
  return { ok: true };
}
