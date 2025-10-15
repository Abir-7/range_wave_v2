ALTER TABLE "user_authentications" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."auth_type";--> statement-breakpoint
CREATE TYPE "public"."auth_type" AS ENUM('email', 'forgot-password', 'resend', 'token');--> statement-breakpoint
ALTER TABLE "user_authentications" ALTER COLUMN "type" SET DATA TYPE "public"."auth_type" USING "type"::"public"."auth_type";