import { numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { streamTable } from "./stream.table";
import { userTable } from "./user.table";

export const storageTable = pgTable("storages", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => userTable.id, {
        onDelete: "cascade",
    }),
    streamId: uuid("stream_id").references(() => streamTable.id, {
        onDelete: "cascade",
    }),
    externalId: text("external_id").notNull(),
    fileName: text("file_name").notNull(),
    fileUrl: text("file_url").notNull(),
    fileType: text("file_type").notNull(),
    startTime: text("start_time"),
    endTime: text("end_time"),
    duration: numeric("duration"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
