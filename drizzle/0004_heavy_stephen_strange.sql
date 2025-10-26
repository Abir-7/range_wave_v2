ALTER TABLE "user_payment_data" DROP CONSTRAINT "user_payment_data_user_profile_id_unique";--> statement-breakpoint
ALTER TABLE "user_payment_data" DROP CONSTRAINT "user_payment_data_user_profile_id_user_profiles_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user_payment_data" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "user_payment_data" ADD CONSTRAINT "user_payment_data_user_id_user_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_payment_data" DROP COLUMN "user_profile_id";--> statement-breakpoint
ALTER TABLE "user_payment_data" ADD CONSTRAINT "user_payment_data_user_id_unique" UNIQUE("user_id");