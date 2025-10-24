ALTER TABLE "service_progress" DROP CONSTRAINT "service_progress_user_id_user_profiles_user_id_fk";
--> statement-breakpoint
ALTER TABLE "service_progress" DROP CONSTRAINT "service_progress_mechanic_id_user_profiles_user_id_fk";
--> statement-breakpoint
ALTER TABLE "service_progress" ADD CONSTRAINT "service_progress_user_id_user_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_progress" ADD CONSTRAINT "service_progress_mechanic_id_user_profiles_user_id_fk" FOREIGN KEY ("mechanic_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE set null ON UPDATE no action;