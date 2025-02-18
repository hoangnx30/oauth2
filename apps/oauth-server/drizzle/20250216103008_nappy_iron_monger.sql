CREATE SCHEMA "oauth";
--> statement-breakpoint
CREATE TABLE "oauth"."oauth_authorization_requests" (
	"id" uuid PRIMARY KEY NOT NULL,
	"client_id" varchar NOT NULL,
	"user_id" uuid NOT NULL,
	"code" varchar NOT NULL,
	"code_challenge" varchar,
	"code_challenge_method" varchar,
	"redirect_uri" varchar NOT NULL,
	"scope" varchar,
	"state" varchar,
	"expiresAt" timestamp NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "oauth_authorization_requests_client_id_unique" UNIQUE("client_id")
);
--> statement-breakpoint
CREATE TABLE "oauth"."oauth_clients" (
	"id" uuid PRIMARY KEY NOT NULL,
	"client_id" varchar(255) NOT NULL,
	"client_secret" varchar,
	"client_name" varchar NOT NULL,
	"client_uri" varchar,
	"redirect_uri" varchar NOT NULL,
	"scope" varchar,
	"isConfidential" boolean DEFAULT false,
	"isActive" boolean DEFAULT true,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "oauth_clients_client_id_unique" UNIQUE("client_id")
);
--> statement-breakpoint
CREATE TABLE "oauth"."oauth_states" (
	"id" uuid PRIMARY KEY NOT NULL,
	"state" varchar NOT NULL,
	"client_id" uuid NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"isUsed" boolean DEFAULT false,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "oauth_states_state_unique" UNIQUE("state")
);
--> statement-breakpoint
CREATE TABLE "oauth"."users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"passwordHash" varchar NOT NULL,
	"email" varchar(255) NOT NULL,
	"isActive" boolean DEFAULT true,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "oauth"."oauth_authorization_requests" ADD CONSTRAINT "oauth_authorization_requests_client_id_oauth_clients_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "oauth"."oauth_clients"("client_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oauth"."oauth_authorization_requests" ADD CONSTRAINT "oauth_authorization_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "oauth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oauth"."oauth_states" ADD CONSTRAINT "oauth_states_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "oauth"."users"("id") ON DELETE no action ON UPDATE no action;