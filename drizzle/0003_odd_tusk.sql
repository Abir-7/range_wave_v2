ALTER TABLE "service_progress" ADD COLUMN "extra_issue" varchar;--> statement-breakpoint
ALTER TABLE "service_progress" ADD COLUMN "extra_issue_desc" varchar;--> statement-breakpoint
ALTER TABLE "service_progress" ADD COLUMN "extra_price" numeric(12, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "service_progress" DROP COLUMN "issue";--> statement-breakpoint
ALTER TABLE "service_progress" DROP COLUMN "extra_amount";