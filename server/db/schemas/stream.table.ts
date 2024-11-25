import { relations } from "drizzle-orm";
import {
    boolean,
    index,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

import { categoryTable } from "./category.table";
import { settingTable } from "./setting.table";
import { streamsToCategoriesTable } from "./stream-category.table";
import { userTable } from "./user.table";

export const streamTable = pgTable(
    "streams",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        name: text("name").notNull(),
        thumbnailUrl: text("thumbnail_url"),
        isLive: boolean("is_live").default(false).notNull(),
        userId: uuid("user_id")
            .notNull()
            .references(() => userTable.id, { onDelete: "cascade" }),
        categoryId: uuid("category_id").references(() => categoryTable.id),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .$onUpdate(() => new Date()),
    },
    (table) => ({
        userUnq: index("user_stream_unq").on(table.userId),
        categoryIdx: index("category_idx").on(table.categoryId),
    }),
);

export const streamRelations = relations(streamTable, ({ one, many }) => ({
    user: one(userTable, {
        fields: [streamTable.userId],
        references: [userTable.id],
    }),
    setting: one(settingTable),
    streamsToCategories: many(streamsToCategoriesTable),
}));
