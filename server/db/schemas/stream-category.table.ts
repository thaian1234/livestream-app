import { relations } from "drizzle-orm";
import {
    boolean,
    index,
    pgTable,
    primaryKey,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

import { categoryTable } from "./category.table";
import { streamTable } from "./stream.table";

export const streamsToCategoriesTable = pgTable(
    "stream_categories",
    {
        streamId: uuid("stream_id")
            .notNull()
            .references(() => streamTable.id, { onDelete: "cascade" }),
        categoryId: uuid("category_id")
            .notNull()
            .references(() => categoryTable.id, { onDelete: "cascade" }),
        isActive: boolean("is_active").default(true).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.streamId, table.categoryId] }),
        streamIdx: index("stream_category_stream_idx").on(table.streamId),
        categoryIdx: index("stream_category_category_idx").on(table.categoryId),
    }),
);

export const streamsToCategoriesRelations = relations(
    streamsToCategoriesTable,
    ({ one }) => ({
        stream: one(streamTable, {
            fields: [streamsToCategoriesTable.streamId],
            references: [streamTable.id],
        }),
        category: one(categoryTable, {
            fields: [streamsToCategoriesTable.categoryId],
            references: [categoryTable.id],
        }),
    }),
);
