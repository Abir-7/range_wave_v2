ALTER TABLE "messages" DROP CONSTRAINT "messages_sender_id_user_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_user_profiles_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE cascade ON UPDATE no action;