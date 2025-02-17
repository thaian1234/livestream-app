import {
    numeric,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

import { streamTable } from "./stream.table";

export const storageStatusEnum = pgEnum("storage_status", [
    "processing",
    "ready",
    "error",
]);

export const storageTable = pgTable("storages", {
    id: uuid("id").primaryKey().defaultRandom(),
    streamId: uuid("stream_id").references(() => streamTable.id, {
        onDelete: "cascade",
    }),
    fileName: text("file_name").notNull(),
    fileUrl: text("file_url").notNull(),
    fileType: text("file_type").notNull(),
    startTime: text("start_time"),
    endTime: text("end_time"),
    duration: numeric("duration"),
    status: storageStatusEnum("status").default("processing").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
