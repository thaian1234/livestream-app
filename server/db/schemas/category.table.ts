import { relations } from "drizzle-orm";
import {
    boolean,
    foreignKey,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

import { streamsToCategoriesTable } from "./stream-category.table";
import { videosToCategoriesTable } from "./video-category.table";

export const categoryTable = pgTable(
    "categories",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        name: text("name").notNull().unique(),
        imageUrl: text("thumbnail_url"),
        parentId: uuid("parent_id"),
        slug: text("slug").notNull().unique(),
        isActive: boolean("is_active").default(true).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (table) => ({
        parentReference: foreignKey({
            columns: [table.parentId],
            foreignColumns: [table.id],
            name: "category_parent_id_fkey",
        }),
    }),
);

export const categoryRelations = relations(categoryTable, ({ many, one }) => ({
    children: many(categoryTable, { relationName: "parent_child" }),
    parent: one(categoryTable, {
        fields: [categoryTable.parentId],
        references: [categoryTable.id],
        relationName: "parent_child",
    }),
    streamsToCategories: many(streamsToCategoriesTable),
    videosToCategories: many(videosToCategoriesTable),
}));
