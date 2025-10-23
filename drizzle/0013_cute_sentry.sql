ALTER TABLE "payments" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."payment_status_enum";--> statement-breakpoint
CREATE TYPE "public"."payment_status_enum" AS ENUM('paid', 'unpaid');--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "status" SET DATA TYPE "public"."payment_status_enum" USING "status"::"public"."payment_status_enum";--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "payment_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."payment_type_enum";--> statement-breakpoint
CREATE TYPE "public"."payment_type_enum" AS ENUM('online', 'offline');--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "payment_type" SET DATA TYPE "public"."payment_type_enum" USING "payment_type"::"public"."payment_type_enum";--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_service_progress_id_unique" UNIQUE("service_progress_id");