ALTER TABLE "mechanic_workshops" ALTER COLUMN "place_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "mechanic_workshops" ALTER COLUMN "experiences" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "mechanic_workshops" ADD COLUMN "start_time" varchar(5) NOT NULL;--> statement-breakpoint
ALTER TABLE "mechanic_workshops" ADD COLUMN "end_time" varchar(5) NOT NULL;--> statement-breakpoint
ALTER TABLE "mechanic_workshops" ADD COLUMN "certificates" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "mechanic_workshops" DROP COLUMN "working_hours";