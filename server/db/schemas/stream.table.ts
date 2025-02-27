import { relations } from "drizzle-orm";
import {
    boolean,
    index,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

import { settingTable } from "./setting.table";
import { storageTable } from "./storage.table";
import { streamsToCategoriesTable } from "./stream-category.table";
import { userTable } from "./user.table";
import { videoTable } from "./video.table";

export const streamTable = pgTable(
    "streams",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        name: text("name").notNull(),
        thumbnailUrl: text("thumbnail_url").default("").notNull(),
        isLive: boolean("is_live").default(false).notNull(),
        userId: uuid("user_id")
            .notNull()
            .references(() => userTable.id, { onDelete: "cascade" }),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .$onUpdate(() => new Date()),
    },
    (table) => [index("user_stream_unq").on(table.userId)],
);

export const streamRelations = relations(streamTable, ({ one, many }) => ({
    user: one(userTable, {
        fields: [streamTable.userId],
        references: [userTable.id],
    }),
    setting: one(settingTable),
    streamsToCategories: many(streamsToCategoriesTable),
    videos: many(videoTable),
    storages: many(storageTable),
}));
