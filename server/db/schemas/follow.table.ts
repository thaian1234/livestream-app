import { relations } from "drizzle-orm";
import {
    index,
    pgTable,
    timestamp,
    uniqueIndex,
    uuid,
} from "drizzle-orm/pg-core";

import { userTable } from "./user.table";

export const followTable = pgTable(
    "follows",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        followerId: uuid("follower_id")
            .notNull()
            .references(() => userTable.id, { onDelete: "cascade" }),
        followedId: uuid("following_id")
            .notNull()
            .references(() => userTable.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .$onUpdate(() => new Date())
            .defaultNow(),
    },
    (table) => ({
        unq: uniqueIndex("follower_following_unq").on(
            table.followerId,
            table.followedId,
        ),
        followerIdx: index("follower_idx").on(table.followerId),
        followedx: index("followed_idx").on(table.followedId),
    }),
);

export const followRelations = relations(followTable, ({ one }) => ({
    following: one(userTable, {
        fields: [followTable.followedId],
        references: [userTable.id],
        relationName: "followed_users",
    }),
    follower: one(userTable, {
        fields: [followTable.followerId],
        references: [userTable.id],
        relationName: "followers",
    }),
}));
