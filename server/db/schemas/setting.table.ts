import { relations } from "drizzle-orm";
import {
    boolean,
    index,
    pgTable,
    text,
    timestamp,
    unique,
    uuid,
} from "drizzle-orm/pg-core";

import { streamTable } from "./stream.table";

export const settingTable = pgTable(
    "settings",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        streamId: uuid("stream_id")
            .notNull()
            .references(() => streamTable.id, { onDelete: "cascade" }),
        isChatDelayed: boolean("is_chat_delayed").default(false).notNull(),
        isChatFollowersOnly: boolean("is_chat_followers_only")
            .default(false)
            .notNull(),
        serverUrl: text("server_url"),
        streamKey: text("stream_key"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .$onUpdate(() => new Date()),
    },
    (table) => ({
        streamUnq: unique("setting_stream_unq").on(table.streamId),
    }),
);

export const settingRelations = relations(settingTable, ({ one }) => ({
    stream: one(streamTable, {
        fields: [settingTable.streamId],
        references: [streamTable.id],
    }),
}));
