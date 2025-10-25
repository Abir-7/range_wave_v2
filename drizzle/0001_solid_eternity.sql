ALTER TABLE "service_progress" ALTER COLUMN "extra_work_accept_status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "service_progress" ALTER COLUMN "extra_work_accept_status" DROP NOT NULL;