import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { blockTable } from "./block.table";
import { followTable } from "./follow.table";
import { sessionTable } from "./session.table";
import { streamTable } from "./stream.table";

export const userTable = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    username: text("username").notNull().unique(),
    email: text("email").notNull().unique(),
    hasedPassword: text("hased_password").notNull(),
    imageUrl: text("image_url"),
    bio: text("bio"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .$onUpdate(() => new Date()),
});

export const userRelations = relations(userTable, ({ many, one }) => ({
    following: many(followTable, { relationName: "followed_users" }),
    followers: many(followTable, { relationName: "followers" }),
    blocking: many(blockTable, { relationName: "blocking" }),
    blockedBy: many(blockTable, { relationName: "blocked_by" }),
    stream: one(streamTable),
    session: one(sessionTable),
}));
