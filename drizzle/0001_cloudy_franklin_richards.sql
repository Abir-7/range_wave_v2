ALTER TYPE "public"."user_role" ADD VALUE 'mechanic';--> statement-breakpoint
ALTER TABLE "user_profiles" ALTER COLUMN "user_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_profiles" ALTER COLUMN "mobile" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_profiles" ALTER COLUMN "address" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_profiles" ALTER COLUMN "gender" DROP NOT NULL;