import { desc, relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { streamTable } from "./stream.table";
import { userTable } from "./user.table";

export const eventTable = pgTable("events", {
    id: uuid("id").primaryKey().defaultRandom(),
    start: timestamp("start").notNull(),
    end: timestamp("end").notNull(),
    title: text("title").notNull(),
    description: text("description").default("").notNull(),
    location: text("location").default("").notNull(),

    userId: uuid("user_id")
        .references(() => userTable.id)
        .notNull(),
    streamId: uuid("stream_id").references(() => streamTable.id),

    createdAt: timestamp("created_at", { mode: "string" })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" })
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date().toISOString()),
});

export const eventRelations = relations(eventTable, ({ one }) => ({
    user: one(userTable, {
        fields: [eventTable.userId],
        references: [userTable.id],
    }),
    stream: one(streamTable, {
        fields: [eventTable.streamId],
        references: [streamTable.id],
    }),
}));
