ALTER TABLE "mechanic_workshops" ALTER COLUMN "workshop_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "mechanic_workshops" ALTER COLUMN "start_time" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "mechanic_workshops" ALTER COLUMN "end_time" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "mechanic_workshops" ALTER COLUMN "services" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "mechanic_workshops" ALTER COLUMN "location_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "mechanic_workshops" ALTER COLUMN "coordinates" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "mechanic_workshops" ADD CONSTRAINT "mechanic_workshops_user_id_unique" UNIQUE("user_id");