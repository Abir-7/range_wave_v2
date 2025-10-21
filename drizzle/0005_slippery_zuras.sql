ALTER TABLE "mechanic_workshops" DROP CONSTRAINT "mechanic_workshops_user_profile_id_user_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "user_cars" DROP CONSTRAINT "user_cars_user_profile_id_user_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "user_locations" DROP CONSTRAINT "user_locations_user_profile_id_user_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "bids" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "mechanic_workshops" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "user_cars" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "user_locations" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "mechanic_workshops" ADD CONSTRAINT "mechanic_workshops_user_id_user_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_cars" ADD CONSTRAINT "user_cars_user_id_user_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_locations" ADD CONSTRAINT "user_locations_user_id_user_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mechanic_workshops" DROP COLUMN "user_profile_id";--> statement-breakpoint
ALTER TABLE "user_cars" DROP COLUMN "user_profile_id";--> statement-breakpoint
ALTER TABLE "user_locations" DROP COLUMN "user_profile_id";