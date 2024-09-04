import { relations } from "drizzle-orm";
import {
    boolean,
    index,
    pgTable,
    text,
    uuid,
    varchar,
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
        ingressId: varchar("ingress_id").unique(),
        serverUrl: text("server_url"),
        streamKey: text("stream_key"),
    },
    (table) => ({
        ingressIdx: index("ingress_idx").on(table.ingressId),
    }),
);

export const settingRelations = relations(settingTable, ({ one }) => ({
    stream: one(streamTable, {
        fields: [settingTable.streamId],
        references: [streamTable.id],
    }),
}));
