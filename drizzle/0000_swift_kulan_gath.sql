CREATE TYPE "public"."payment_status_enum" AS ENUM('paid', 'unpaid', 'failed');--> statement-breakpoint
CREATE TYPE "public"."payment_type_enum" AS ENUM('online', 'offline');--> statement-breakpoint
CREATE TYPE "public"."bid_status" AS ENUM('provided', 'declined');--> statement-breakpoint
CREATE TYPE "public"."extra_work_accept_enum" AS ENUM('accepted', 'rejected', 'pending');--> statement-breakpoint
CREATE TYPE "public"."service_status" AS ENUM('FINDING', 'ON_THE_WAY', 'WORKING', 'NEED_TO_PAY', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."auth_type" AS ENUM('email', 'forgot-password', 'resend', 'token');--> statement-breakpoint
CREATE TYPE "public"."gender_enum" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('super_admin', 'user', 'mechanic');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'pending_verification', 'blocked', 'disabled', 'deleted');--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_id" uuid,
	"sender_id" uuid NOT NULL,
	"message" text,
	"image_id" text,
	"image" text,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "chat_rooms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"mechanic_id" uuid NOT NULL,
	"last_message_id" uuid,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "payments_for_workshop" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tx_id" text,
	"mechanic_id" uuid NOT NULL,
	"total_amount" numeric(12, 2) NOT NULL,
	"status" "payment_status_enum" NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "payments_for_workshop_tx_id_unique" UNIQUE("tx_id"),
	CONSTRAINT "payments_for_workshop_mechanic_id_unique" UNIQUE("mechanic_id")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tx_id" text,
	"service_progress_id" uuid NOT NULL,
	"status" "payment_status_enum" NOT NULL,
	"payment_type" "payment_type_enum" NOT NULL,
	"total_amount" numeric(12, 2) NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "rating_by_mechanic" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rating" integer NOT NULL,
	"text" text NOT NULL,
	"mechanic_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"service_progress_id" uuid NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "rating_by_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rating" integer NOT NULL,
	"text" text NOT NULL,
	"mechanic_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"service_progress_id" uuid NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "bids" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_id" uuid NOT NULL,
	"mechanic_id" uuid NOT NULL,
	"price" numeric(20, 2) NOT NULL,
	"status" "bid_status" NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "service_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bid_id" uuid,
	"service_id" uuid,
	"chat_id" uuid,
	"user_id" uuid,
	"mechanic_id" uuid,
	"extra_issue" varchar,
	"extra_issue_desc" varchar,
	"extra_price" numeric(12, 2) DEFAULT '0',
	"status" "service_status" DEFAULT 'FINDING' NOT NULL,
	"is_scheduled" boolean DEFAULT false NOT NULL,
	"extra_work_accept_status" "extra_work_accept_enum",
	"cancel_reason" varchar(5255),
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "service_progress_service_id_unique" UNIQUE("service_id")
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"issue" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"scheduled_date" timestamp,
	"address" text,
	"coordinates" numeric(10, 6)[] NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_payment_data" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"account_id" varchar(255),
	"is_active" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "user_payment_data_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "mechanic_workshops" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"workshop_name" varchar(150),
	"start_time" varchar(5),
	"end_time" varchar(5),
	"services" jsonb,
	"location_name" varchar(150),
	"place_id" varchar(255),
	"coordinates" numeric(10, 6)[],
	"experiences" jsonb,
	"certificates" jsonb DEFAULT '[]'::jsonb,
	"is_conflict" boolean DEFAULT false,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "mechanic_workshops_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user_authentications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"otp" varchar(10),
	"token" text,
	"type" "auth_type" NOT NULL,
	"expire_date" timestamp NOT NULL,
	"is_success" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_cars" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"car_name" varchar(100),
	"car_model" varchar(100),
	"vin_code" varchar(100),
	"license_plate" varchar(50),
	"tag_number" varchar(50),
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_locations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"apartment_no" varchar(50),
	"road_no" varchar(50),
	"state" varchar(100),
	"city" varchar(100),
	"zip_code" varchar(20),
	"address" text,
	"country" varchar(100),
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"full_name" varchar(100) NOT NULL,
	"user_name" varchar(50),
	"mobile" varchar(20),
	"address" text,
	"gender" "gender_enum",
	"image" text,
	"image_id" text,
	"is_profile_completed" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "user_profiles_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "user_profiles_user_name_unique" UNIQUE("user_name"),
	CONSTRAINT "user_profiles_mobile_unique" UNIQUE("mobile")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(320) NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"password_hash" text NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"status" "user_status" DEFAULT 'pending_verification' NOT NULL,
	"need_to_reset_password" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_room_id_chat_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."chat_rooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_user_profiles_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_user_id_user_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_mechanic_id_user_profiles_user_id_fk" FOREIGN KEY ("mechanic_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments_for_workshop" ADD CONSTRAINT "payments_for_workshop_mechanic_id_mechanic_workshops_user_id_fk" FOREIGN KEY ("mechanic_id") REFERENCES "public"."mechanic_workshops"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_service_progress_id_service_progress_id_fk" FOREIGN KEY ("service_progress_id") REFERENCES "public"."service_progress"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rating_by_mechanic" ADD CONSTRAINT "rating_by_mechanic_mechanic_id_user_profiles_user_id_fk" FOREIGN KEY ("mechanic_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rating_by_mechanic" ADD CONSTRAINT "rating_by_mechanic_user_id_user_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rating_by_mechanic" ADD CONSTRAINT "rating_by_mechanic_service_progress_id_service_progress_id_fk" FOREIGN KEY ("service_progress_id") REFERENCES "public"."service_progress"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rating_by_user" ADD CONSTRAINT "rating_by_user_mechanic_id_user_profiles_user_id_fk" FOREIGN KEY ("mechanic_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rating_by_user" ADD CONSTRAINT "rating_by_user_user_id_user_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rating_by_user" ADD CONSTRAINT "rating_by_user_service_progress_id_service_progress_id_fk" FOREIGN KEY ("service_progress_id") REFERENCES "public"."service_progress"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bids" ADD CONSTRAINT "bids_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bids" ADD CONSTRAINT "bids_mechanic_id_user_profiles_user_id_fk" FOREIGN KEY ("mechanic_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_progress" ADD CONSTRAINT "service_progress_bid_id_bids_id_fk" FOREIGN KEY ("bid_id") REFERENCES "public"."bids"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_progress" ADD CONSTRAINT "service_progress_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_progress" ADD CONSTRAINT "service_progress_chat_id_chat_rooms_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chat_rooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_progress" ADD CONSTRAINT "service_progress_user_id_user_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_progress" ADD CONSTRAINT "service_progress_mechanic_id_user_profiles_user_id_fk" FOREIGN KEY ("mechanic_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_user_id_user_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_payment_data" ADD CONSTRAINT "user_payment_data_user_id_user_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mechanic_workshops" ADD CONSTRAINT "mechanic_workshops_user_id_user_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_authentications" ADD CONSTRAINT "user_authentications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_cars" ADD CONSTRAINT "user_cars_user_id_user_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_locations" ADD CONSTRAINT "user_locations_user_id_user_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;