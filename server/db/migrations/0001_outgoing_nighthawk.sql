CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"videoId" uuid NOT NULL,
	"content" text,
	"type" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "videoLikes" (
	"userId" uuid NOT NULL,
	"videoId" uuid NOT NULL,
	"type" integer NOT NULL,
	CONSTRAINT "videoLikes_userId_videoId_pk" PRIMARY KEY("userId","videoId")
);
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_videoId_videos_id_fk" FOREIGN KEY ("videoId") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "videoLikes" ADD CONSTRAINT "videoLikes_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "videoLikes" ADD CONSTRAINT "videoLikes_videoId_videos_id_fk" FOREIGN KEY ("videoId") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "videoLike_user_idx" ON "videoLikes" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "videoLike_video_idx" ON "videoLikes" USING btree ("videoId");--> statement-breakpoint
ALTER TABLE "videos" DROP COLUMN "like_count";--> statement-breakpoint
ALTER TABLE "videos" DROP COLUMN "dislike_count";