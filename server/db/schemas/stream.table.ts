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
            .references(() => userTable.id, { onDelete: "cascade" })
            .unique(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .$onUpdate(() => new Date()),
    },
    (table) => ({
        userIdx: index("user_stream_idx").on(table.userId),
    }),
);

export const streamRelations = relations(streamTable, ({ one }) => ({
    user: one(userTable, {
        fields: [streamTable.userId],
        references: [userTable.id],
    }),
    setting: one(settingTable),
}));
