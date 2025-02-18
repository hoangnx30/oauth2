CREATE TABLE "oauth"."jwt_tokens" (
	"id" integer PRIMARY KEY NOT NULL,
	"refresh_token" varchar,
	"user_id" uuid NOT NULL,
	"ip_address" varchar(45),
	"user_agent" varchar,
	"expires_at" timestamp,
	"revoked_at" timestamp,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "oauth"."oauth_authorization_requests" RENAME COLUMN "expiresAt" TO "expires_at";--> statement-breakpoint
ALTER TABLE "oauth"."oauth_clients" RENAME COLUMN "isConfidential" TO "is_confidential";--> statement-breakpoint
ALTER TABLE "oauth"."oauth_clients" RENAME COLUMN "isActive" TO "is_active";--> statement-breakpoint
ALTER TABLE "oauth"."oauth_states" RENAME COLUMN "expiresAt" TO "expires_at";--> statement-breakpoint
ALTER TABLE "oauth"."oauth_states" RENAME COLUMN "isUsed" TO "is_used";--> statement-breakpoint
ALTER TABLE "oauth"."users" RENAME COLUMN "passwordHash" TO "password_hash";--> statement-breakpoint
ALTER TABLE "oauth"."users" RENAME COLUMN "isActive" TO "is_active";--> statement-breakpoint
ALTER TABLE "oauth"."oauth_authorization_requests" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "oauth"."oauth_clients" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "oauth"."oauth_states" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "oauth"."users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "oauth"."oauth_clients" ADD COLUMN "create_by" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "oauth"."jwt_tokens" ADD CONSTRAINT "jwt_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "oauth"."users"("id") ON DELETE no action ON UPDATE no action;