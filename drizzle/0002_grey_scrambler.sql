ALTER TABLE "service_progress" ALTER COLUMN "extra_amount" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "service_progress" ALTER COLUMN "extra_amount" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "service_progress" ALTER COLUMN "cancel_reason" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "service_progress" DROP COLUMN "amount";