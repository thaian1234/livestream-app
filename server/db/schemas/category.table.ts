import { relations } from "drizzle-orm";
import {
    foreignKey,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

import { streamsToCategoriesTable } from "./stream-category.table";

export const categoryTable = pgTable(
    "categories",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        name: text("name").notNull().unique(),
        description: text("description"),
        thumbnailUrl: text("thumbnail_url"),
        parentId: uuid("parent_id"),
        slug: text("slug").notNull().unique(),
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
}));
