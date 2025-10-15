CREATE TYPE "public"."user_status" AS ENUM('active', 'pending_verification', 'blocked', 'disabled', 'deleted');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "status" "user_status" DEFAULT 'pending_verification' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "is_blocked";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "is_disabled";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "is_deleted";