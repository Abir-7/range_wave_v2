ALTER TABLE "service_progress" DROP CONSTRAINT "service_progress_bid_id_bids_id_fk";
--> statement-breakpoint
ALTER TABLE "service_progress" ADD CONSTRAINT "service_progress_bid_id_bids_id_fk" FOREIGN KEY ("bid_id") REFERENCES "public"."bids"("id") ON DELETE set null ON UPDATE no action;