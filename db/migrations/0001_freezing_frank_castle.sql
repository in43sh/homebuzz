CREATE TYPE "public"."delivery_method" AS ENUM('standard', 'express');--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "subtotal" numeric(10, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_cost" numeric(10, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "tax" numeric(10, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "delivery_method" "delivery_method" DEFAULT 'standard' NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_name" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_line1" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_line2" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_city" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_state" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_zip" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_country" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_phone" text;--> statement-breakpoint
-- Orders placed before checkout stored only a total (subtotal + 8% tax), so
-- derive the two parts once here instead of on every page view.
UPDATE "orders" SET "subtotal" = round("total" / 1.08, 2), "tax" = "total" - round("total" / 1.08, 2);
