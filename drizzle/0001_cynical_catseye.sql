CREATE TYPE "public"."bid_hired_status" AS ENUM('accepted', 'declined', 'pending');--> statement-breakpoint
ALTER TABLE "user_cars" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "bids" ADD COLUMN "bid_hired_status" "bid_hired_status" DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "car_id" uuid NOT NULL;