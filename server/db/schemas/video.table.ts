import { relations } from "drizzle-orm";
import {
    index,
    integer,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

import { storageTable } from "./storage.table";
import { streamTable } from "./stream.table";
import { userTable } from "./user.table";
import { videosToCategoriesTable } from "./video-category.table";

export const videoVisibilityEnum = pgEnum("video_privacy", [
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
        storageId: uuid("storage_id").references(() => storageTable.id, {
            onDelete: "cascade",
        }),
        title: varchar("title", { length: 255 }).notNull(),
        description: text("description"),
        videoUrl: text("video_url").notNull(),
        thumbnailUrl: text("thumbnail_url"),
        duration: integer("duration"),
        viewCount: integer("view_count").default(0).notNull(),
        likeCount: integer("like_count").default(0).notNull(),
        dislikeCount: integer("dislike_count").default(0).notNull(),
        visibility: videoVisibilityEnum().default("private").notNull(),
        status: videoStatusEnum("processing").default("processing").notNull(),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [index("user_stream_idx").on(table.userId, table.streamId)],
);

export const videoRelations = relations(videoTable, ({ one, many }) => ({
    stream: one(streamTable, {
        fields: [videoTable.streamId],
        references: [streamTable.id],
    }),
    user: one(userTable, {
        fields: [videoTable.userId],
        references: [userTable.id],
    }),
    storage: one(storageTable, {
        fields: [videoTable.storageId],
        references: [storageTable.id],
    }),
    videosToCategories: many(videosToCategoriesTable),
}));
