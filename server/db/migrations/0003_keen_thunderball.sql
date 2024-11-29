ALTER TABLE "categories" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN IF EXISTS "description";--> statement-breakpoint
ALTER TABLE "stream_categories" DROP COLUMN IF EXISTS "is_active";