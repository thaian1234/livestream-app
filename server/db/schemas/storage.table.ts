import { relations } from "drizzle-orm";
import {
    numeric,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

import { streamTable } from "./stream.table";
import { videoTable } from "./video.table";

export const storageStatusEnum = pgEnum("storage_status", [
    "processing",
    "ready",
    "error",
]);

export const storageTable = pgTable("storages", {
    id: uuid("id").primaryKey().defaultRandom(),
    streamId: uuid("stream_id")
        .references(() => streamTable.id, {
            onDelete: "cascade",
        })
        .notNull(),
    fileName: text("file_name"),
    fileUrl: text("file_url"),
    fileType: text("file_type"),
    startTime: timestamp("start_time"),
    endTime: timestamp("end_time"),
    status: storageStatusEnum("status").default("processing").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const storageRelations = relations(storageTable, ({ one, many }) => ({
    stream: one(streamTable, {
        fields: [storageTable.streamId],
        references: [streamTable.id],
    }),
    videos: many(videoTable),
}));
