import { relations } from "drizzle-orm";
import {
    boolean,
    index,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

import { userTable } from "./user.table";

export const streamTable = pgTable(
    "streams",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        name: text("name").notNull(),
        thumbnailUrl: text("thumbnail_url"),
        ingressId: varchar("ingress_id").unique(),
        serverUrl: text("server_url"),
        streamKey: text("stream_key"),
        isLive: boolean("is_live").default(false).notNull(),
        isChatEnabled: boolean("is_chat_enabled").default(true).notNull(),
        isChatDelayed: boolean("is_chat_delayed").default(false).notNull(),
        isChatFollowersOnly: boolean("is_chat_followers_only")
            .default(false)
            .notNull(),
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
        userIdx: index("user_idx").on(table.userId),
        ingressIdx: index("ingress_idx").on(table.ingressId),
    }),
);

export const streamRelations = relations(streamTable, ({ one }) => ({
    user: one(userTable, {
        fields: [streamTable.userId],
        references: [userTable.id],
    }),
}));
