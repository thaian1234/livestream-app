import { relations } from "drizzle-orm";
import {
    index,
    integer,
    pgTable,
    primaryKey,
    text,
    timestamp,
    uniqueIndex,
    uuid,
} from "drizzle-orm/pg-core";

import { userTable } from "./user.table";
import { videoTable } from "./video.table";

export const commentTable = pgTable("comments", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("userId")
        .notNull()
        .references(() => userTable.id, { onDelete: "cascade" }),
    videoId: uuid("videoId")
        .notNull()
        .references(() => videoTable.id, { onDelete: "cascade" }),
    content: text("content"),
    status: integer("type").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .$onUpdate(() => new Date())
        .defaultNow(),
});

export const commentRelations = relations(commentTable, ({ one }) => ({
    user: one(userTable, {
        fields: [commentTable.userId],
        references: [userTable.id],
    }),
    video: one(videoTable, {
        fields: [commentTable.videoId],
        references: [videoTable.id],
    }),
}));
