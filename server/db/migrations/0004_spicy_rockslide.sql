ALTER TABLE "streams" ALTER COLUMN "thumbnail_url" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "streams" ALTER COLUMN "thumbnail_url" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "image_url" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "image_url" SET NOT NULL;