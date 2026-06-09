import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signUpSchema = signInSchema
  .extend({
    name: z.string().min(2, "Enter your name"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1, "Pick a rating").max(5),
  body: z.string().max(1000).optional(),
});

export type ReviewValues = z.infer<typeof reviewSchema>;

export const productSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().max(2000).optional().default(""),
  price: z.coerce.number().positive("Price must be greater than 0"),
  unit: z.string().min(1).default("each"),
  categoryId: z.coerce.number().int().positive("Pick a category"),
  // Local public-path only: `next/image` throws on remote hosts unless they're
  // in next.config images.remotePatterns, which we don't configure.
  image: z
    .string()
    .default("")
    .refine((v) => v === "" || v.startsWith("/"), {
      message:
        "Image must be a local path starting with / (e.g. /products/drill.png)",
    }),
  stock: z.coerce.number().int().min(0).default(0),
  onSale: z.coerce.boolean().default(false),
});

export type ProductValues = z.infer<typeof productSchema>;
export type ProductInput = z.input<typeof productSchema>;
