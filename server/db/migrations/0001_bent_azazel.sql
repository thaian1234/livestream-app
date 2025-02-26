CREATE TABLE "video_categories" (
	"video_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "video_categories_video_id_category_id_pk" PRIMARY KEY("video_id","category_id")
);
--> statement-breakpoint
ALTER TABLE "storages" ALTER COLUMN "file_name" SET DEFAULT 'Video Processing';--> statement-breakpoint
ALTER TABLE "storages" ALTER COLUMN "file_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "videos" ADD COLUMN "dislike_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "video_categories" ADD CONSTRAINT "video_categories_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_categories" ADD CONSTRAINT "video_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "video_category_video_idx" ON "video_categories" USING btree ("video_id");--> statement-breakpoint
CREATE INDEX "video_category_category_idx" ON "video_categories" USING btree ("category_id");