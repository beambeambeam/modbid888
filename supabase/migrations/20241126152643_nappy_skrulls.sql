CREATE TABLE IF NOT EXISTS "minigamelogs" (
	"id" serial PRIMARY KEY NOT NULL,
	"minigame_id" serial NOT NULL,
	"timestamp" timestamp NOT NULL,
	"action" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "minigamelogs" ADD CONSTRAINT "minigamelogs_minigame_id_minigames_id_fk" FOREIGN KEY ("minigame_id") REFERENCES "public"."minigames"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
