import { relations } from "drizzle-orm";
import {
    index,
    integer,
    pgTable,
    primaryKey,
    timestamp,
    uniqueIndex,
    uuid,
} from "drizzle-orm/pg-core";

import { userTable } from "./user.table";
import { videoTable } from "./video.table";

export const videoLikeTable = pgTable(
    "videoLikes",
    {
        userId: uuid("userId")
            .notNull()
            .references(() => userTable.id, { onDelete: "cascade" }),
        videoId: uuid("videoId")
            .notNull()
            .references(() => videoTable.id, { onDelete: "cascade" }),
        type: integer("type").notNull(), // 1 = like, -1 = dislike
    },
    (table) => ({
        unq: primaryKey({ columns: [table.userId, table.videoId] }),
        userIdIdx: index("videoLike_user_idx").on(table.userId),
        videoIdx: index("videoLike_video_idx").on(table.videoId),
    }),
);

export const videoLikeRelations = relations(videoLikeTable, ({ one }) => ({
    user: one(userTable, {
        fields: [videoLikeTable.userId],
        references: [userTable.id],
    }),
    video: one(videoTable, {
        fields: [videoLikeTable.videoId],
        references: [videoTable.id],
    }),
}));
