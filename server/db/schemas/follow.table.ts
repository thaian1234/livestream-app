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
        followed: uuid("following_id")
            .notNull()
            .references(() => userTable.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .$onUpdate(() => new Date()),
    },
    (table) => ({
        unq: uniqueIndex("follower_following_unq").on(
            table.followerId,
            table.followed,
        ),
        followerIdx: index("follower_idx").on(table.followerId),
        followedx: index("following_idx").on(table.followed),
    }),
);

export const followRelations = relations(followTable, ({ one }) => ({
    following: one(userTable, {
        fields: [followTable.followed],
        references: [userTable.id],
        relationName: "followed_users",
    }),
    follower: one(userTable, {
        fields: [followTable.followerId],
        references: [userTable.id],
        relationName: "followers",
    }),
}));
