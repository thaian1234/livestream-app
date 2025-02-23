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
import { videoTable } from "./video.table";

export const videosToCategoriesTable = pgTable(
    "video_categories",
    {
        videoId: uuid("video_id")
            .notNull()
            .references(() => videoTable.id, { onDelete: "cascade" }),
        categoryId: uuid("category_id")
            .notNull()
            .references(() => categoryTable.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.videoId, table.categoryId] }),
        videoIdx: index("video_category_video_idx").on(table.videoId),
        categoryIdx: index("video_category_category_idx").on(table.categoryId),
    }),
);

export const videosToCategoriesRelations = relations(
    videosToCategoriesTable,
    ({ one }) => ({
        video: one(videoTable, {
            fields: [videosToCategoriesTable.videoId],
            references: [videoTable.id],
        }),
        category: one(categoryTable, {
            fields: [videosToCategoriesTable.categoryId],
            references: [categoryTable.id],
        }),
    }),
);
