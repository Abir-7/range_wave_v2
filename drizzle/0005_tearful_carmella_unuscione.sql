ALTER TABLE "chat_rooms" DROP CONSTRAINT "chat_rooms_last_message_id_messages_id_fk";
--> statement-breakpoint
ALTER TABLE "payments_for_workshop" DROP CONSTRAINT "payments_for_workshop_mechanic_id_mechanic_workshops_user_id_fk";
--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "room_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "message" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "image_id" text;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_room_id_chat_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."chat_rooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments_for_workshop" ADD CONSTRAINT "payments_for_workshop_mechanic_id_mechanic_workshops_user_id_fk" FOREIGN KEY ("mechanic_id") REFERENCES "public"."mechanic_workshops"("user_id") ON DELETE cascade ON UPDATE no action;