ALTER TYPE "public"."payment_status_enum" ADD VALUE 'failed';--> statement-breakpoint
ALTER TABLE "payments" DROP CONSTRAINT "payments_service_progress_id_unique";--> statement-breakpoint
DROP INDEX "unique_user_mechanic";