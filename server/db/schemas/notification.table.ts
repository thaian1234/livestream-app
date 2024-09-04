import {
    boolean,
    index,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

import { streamTable } from "./stream.table";
import { userTable } from "./user.table";

export const typeEnum = pgEnum("type", [
    "stream_start",
    "stream_end",
    "new_follower",
]);

export const notificationTable = pgTable(
    "notifications",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        userId: uuid("user_id")
            .notNull()
            .references(() => userTable.id, { onDelete: "cascade" }),
        streamId: uuid("stream_id").references(() => streamTable.id, {
            onDelete: "cascade",
        }),
        type: typeEnum("type").notNull(),
        message: text("message").notNull(),
        isRead: boolean("is_read").default(false).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .$onUpdate(() => new Date()),
    },
    (table) => {
        return {
            userIdx: index("user_notification_idx").on(table.userId),
            streamIdx: index("stream_notification_idx").on(table.streamId),
        };
    },
);
