import { z } from "zod";
import { DELIVERY_METHOD_KEYS } from "@/lib/pricing";
import { US_STATE_CODES } from "@/lib/us-states";

export const signInSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
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
  // Required, local public-path only: `next/image` throws on an empty src and
  // on remote hosts not listed in next.config images.remotePatterns (none set).
  image: z
    .string()
    .min(1, "Image path is required")
    .refine((v) => v.startsWith("/"), {
      message:
        "Image must be a local path starting with / (e.g. /products/drill.png)",
    }),
  stock: z.coerce.number().int().min(0).default(0),
  onSale: z.coerce.boolean().default(false),
});

export type ProductValues = z.infer<typeof productSchema>;
export type ProductInput = z.input<typeof productSchema>;

/** The shipping address and delivery choice collected at checkout. */
export const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Enter the recipient's full name"),
  line1: z.string().trim().min(3, "Enter a street address"),
  line2: z.string().trim().max(100).optional().default(""),
  city: z.string().trim().min(2, "Enter a city"),
  state: z
    .string()
    .refine((v) => US_STATE_CODES.includes(v), { message: "Choose a state" }),
  zip: z
    .string()
    .trim()
    .regex(/^\d{5}(-\d{4})?$/, "Enter a 5-digit ZIP code, like 78701"),
  // Optional; carriers use it for delivery. Digits and common separators only.
  phone: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine((v) => v === "" || /^[\d\s()+.-]{10,20}$/.test(v), {
      message: "Enter a phone number with area code, or leave it blank",
    }),
  deliveryMethod: z.enum(DELIVERY_METHOD_KEYS),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;
export type CheckoutInput = z.input<typeof checkoutSchema>;
