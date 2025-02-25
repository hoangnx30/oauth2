CREATE SCHEMA "oauth";
--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('initiated', 'authenticated', 'approved', 'denied', 'expired');--> statement-breakpoint
CREATE TABLE "oauth"."oauth_authorization_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"user_id" integer,
	"redirect_uri" varchar NOT NULL,
	"state" varchar(1000) NOT NULL,
	"scopes" varchar(1000) NOT NULL,
	"code_challenge" varchar(255),
	"code_challenge_method" varchar(20),
	"status" "status" DEFAULT 'initiated' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "oauth"."oauth_clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" varchar(255) NOT NULL,
	"client_secret" varchar,
	"client_name" varchar NOT NULL,
	"client_uri" varchar,
	"redirect_uri" varchar NOT NULL,
	"scope" varchar,
	"is_confidential" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true,
	"create_by" integer NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "oauth_clients_client_id_unique" UNIQUE("client_id")
);
--> statement-breakpoint
CREATE TABLE "oauth"."users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"password_hash" varchar NOT NULL,
	"email" varchar(255) NOT NULL,
	"is_active" boolean DEFAULT true,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "oauth"."jwt_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"refresh_token" varchar,
	"user_id" integer NOT NULL,
	"ip_address" varchar(45),
	"user_agent" varchar,
	"expires_at" timestamp,
	"revoked_at" timestamp,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "oauth"."oauth_access_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"accessToken" varchar(255) NOT NULL,
	"client_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"expires_at" timestamp NOT NULL,
	"scope" varchar,
	"is_revoked" boolean DEFAULT false,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "oauth_access_tokens_accessToken_unique" UNIQUE("accessToken")
);
--> statement-breakpoint
CREATE TABLE "oauth"."oauth_refresh_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"refresh_token" varchar(255) NOT NULL,
	"access_token_id" serial NOT NULL,
	"client_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"expires_at" timestamp NOT NULL,
	"is_revoked" boolean DEFAULT false,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "oauth_refresh_tokens_refresh_token_unique" UNIQUE("refresh_token")
);
--> statement-breakpoint
CREATE TABLE "oauth"."oauth_authorization_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"oauth_request_id" integer NOT NULL,
	"code" varchar(255) NOT NULL,
	"client_id" integer NOT NULL,
	"user_id" integer,
	"expires_at" timestamp NOT NULL,
	"is_used" boolean DEFAULT false,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "oauth_authorization_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "oauth"."oauth_authorization_approvals" (
	"id" serial PRIMARY KEY NOT NULL,
	"oauthRequestId" integer NOT NULL,
	"user_id" integer NOT NULL,
	"approved_scopes" varchar NOT NULL,
	"remember_approval" boolean DEFAULT false,
	"ip_address" varchar(45),
	"user_agent" text,
	"expires_at" timestamp,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "oauth"."oauth_authorization_denials" (
	"id" serial PRIMARY KEY NOT NULL,
	"authorization_request_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"denial_reason" varchar(1000),
	"ip_address" varchar(45),
	"user_agent" varchar(65535),
	"remember_denial" boolean DEFAULT false,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "oauth"."oauth_user_consents" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"scopes" varchar NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "oauth"."jwt_tokens" ADD CONSTRAINT "jwt_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "oauth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oauth"."oauth_access_tokens" ADD CONSTRAINT "oauth_access_tokens_client_id_oauth_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "oauth"."oauth_clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oauth"."oauth_access_tokens" ADD CONSTRAINT "oauth_access_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "oauth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oauth"."oauth_refresh_tokens" ADD CONSTRAINT "oauth_refresh_tokens_access_token_id_oauth_access_tokens_id_fk" FOREIGN KEY ("access_token_id") REFERENCES "oauth"."oauth_access_tokens"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oauth"."oauth_refresh_tokens" ADD CONSTRAINT "oauth_refresh_tokens_client_id_oauth_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "oauth"."oauth_clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oauth"."oauth_refresh_tokens" ADD CONSTRAINT "oauth_refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "oauth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oauth"."oauth_authorization_codes" ADD CONSTRAINT "oauth_authorization_codes_oauth_request_id_oauth_authorization_requests_id_fk" FOREIGN KEY ("oauth_request_id") REFERENCES "oauth"."oauth_authorization_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oauth"."oauth_authorization_codes" ADD CONSTRAINT "oauth_authorization_codes_client_id_oauth_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "oauth"."oauth_clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oauth"."oauth_authorization_codes" ADD CONSTRAINT "oauth_authorization_codes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "oauth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oauth"."oauth_authorization_approvals" ADD CONSTRAINT "oauth_authorization_approvals_oauthRequestId_oauth_authorization_requests_id_fk" FOREIGN KEY ("oauthRequestId") REFERENCES "oauth"."oauth_authorization_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oauth"."oauth_authorization_approvals" ADD CONSTRAINT "oauth_authorization_approvals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "oauth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oauth"."oauth_authorization_denials" ADD CONSTRAINT "oauth_authorization_denials_authorization_request_id_oauth_authorization_requests_id_fk" FOREIGN KEY ("authorization_request_id") REFERENCES "oauth"."oauth_authorization_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oauth"."oauth_authorization_denials" ADD CONSTRAINT "oauth_authorization_denials_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "oauth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oauth"."oauth_user_consents" ADD CONSTRAINT "oauth_user_consents_client_id_oauth_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "oauth"."oauth_clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oauth"."oauth_user_consents" ADD CONSTRAINT "oauth_user_consents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "oauth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "access_token_idx" ON "oauth"."oauth_access_tokens" USING btree ("accessToken");--> statement-breakpoint
CREATE INDEX "oauth_access_token_user_client_id" ON "oauth"."oauth_access_tokens" USING btree ("client_id","user_id");--> statement-breakpoint
CREATE INDEX "refresh_token_idx" ON "oauth"."oauth_refresh_tokens" USING btree ("refresh_token");--> statement-breakpoint
CREATE INDEX "oauth_refresh_token_user_client_id" ON "oauth"."oauth_refresh_tokens" USING btree ("client_id","user_id");--> statement-breakpoint
CREATE INDEX "idx_code" ON "oauth"."oauth_authorization_codes" USING btree ("code");--> statement-breakpoint
CREATE INDEX "idx_user_client" ON "oauth"."oauth_authorization_codes" USING btree ("user_id","client_id");--> statement-breakpoint
CREATE INDEX "oauth_authorization-approval_idx_user_id" ON "oauth"."oauth_authorization_approvals" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_expires" ON "oauth"."oauth_authorization_approvals" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "oauth_authorization_denials_idx_user_id" ON "oauth"."oauth_authorization_denials" USING btree ("user_id");