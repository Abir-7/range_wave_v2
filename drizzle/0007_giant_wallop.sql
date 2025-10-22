ALTER TABLE "services" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "coordinates" numeric(10, 6)[] DEFAULT '{"90.4125","23.8103"}' NOT NULL;