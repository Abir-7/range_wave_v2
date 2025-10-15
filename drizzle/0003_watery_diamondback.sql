CREATE TYPE "public"."auth_type" AS ENUM('email', 'password');--> statement-breakpoint
ALTER TABLE "user_authentications" ALTER COLUMN "otp" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_authentications" ADD COLUMN "type" "auth_type" NOT NULL;