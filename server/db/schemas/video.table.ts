import { relations } from "drizzle-orm";
import {
    index,
    integer,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

import { streamTable } from "./stream.table";
import { userTable } from "./user.table";

export const videoPrivacyEnum = pgEnum("video_privacy", [
    "public",
    "private",
    "followers_only",
    "unlisted",
]);

export const videoStatusEnum = pgEnum("video_status", [
    "processing",
    "ready",
    "error",
]);

export const videoTable = pgTable(
    "videos",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        streamId: uuid("stream_id")
            .references(() => streamTable.id, { onDelete: "cascade" })
            .notNull(),
        userId: uuid("user_id")
            .references(() => userTable.id, { onDelete: "cascade" })
            .notNull(),
        title: varchar("title", { length: 255 }).notNull(),
        description: text("description"),
        videoUrl: text("video_url"),
        thumbnailUrl: text("thumbnail_url"),
        duration: integer("duration"),
        viewCount: integer("view_count").default(0),
        likeCount: integer("like_count").default(0),
        privacy: videoPrivacyEnum("privacy").default("private"),
        status: videoStatusEnum("processing").default("processing"),

        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow(),
    },
    (table) => ({
        user_stream_id_unq: index("user_stream_idx").on(
            table.userId,
            table.streamId,
        ),
    }),
);

export const videoRelations = relations(videoTable, ({ one }) => ({
    stream: one(streamTable, {
        fields: [videoTable.streamId],
        references: [streamTable.id],
    }),
    user: one(userTable, {
        fields: [videoTable.userId],
        references: [userTable.id],
    }),
}));
