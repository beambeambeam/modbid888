CREATE TABLE IF NOT EXISTS "betlogs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"timestamp" timestamp NOT NULL,
	"minigames_id" serial NOT NULL,
	"bet_amount" text NOT NULL,
	"bet_result" text NOT NULL,
	"profit" text NOT NULL,
	"multiplier" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "minigames" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"win_multiplier" numeric NOT NULL,
	"loss_multiplier" numeric NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_logs" RENAME TO "userlogs";--> statement-breakpoint
ALTER TABLE "userlogs" DROP CONSTRAINT "user_logs_user_id_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "betlogs" ADD CONSTRAINT "betlogs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "betlogs" ADD CONSTRAINT "betlogs_minigames_id_minigames_id_fk" FOREIGN KEY ("minigames_id") REFERENCES "public"."minigames"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userlogs" ADD CONSTRAINT "userlogs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
