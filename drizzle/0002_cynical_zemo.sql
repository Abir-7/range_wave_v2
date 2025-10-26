ALTER TABLE "user_payment_data" ALTER COLUMN "user_profile_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_cars" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_cars" ALTER COLUMN "car_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_cars" ALTER COLUMN "car_model" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_cars" ALTER COLUMN "vin_code" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_cars" ALTER COLUMN "license_plate" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_cars" ALTER COLUMN "tag_number" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_locations" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_locations" ALTER COLUMN "apartment_no" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_locations" ALTER COLUMN "road_no" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_locations" ALTER COLUMN "state" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_locations" ALTER COLUMN "city" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_locations" ALTER COLUMN "zip_code" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_locations" ALTER COLUMN "address" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_locations" ALTER COLUMN "country" DROP NOT NULL;