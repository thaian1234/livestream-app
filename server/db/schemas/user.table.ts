import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { accountTable } from "./account.table";
import { blockTable } from "./block.table";
import { commentTable } from "./comment.table";
import { emailVerificationTable } from "./email-verification.table";
import { followTable } from "./follow.table";
import { forgetPasswordTable } from "./forget-password.table";
import { sessionTable } from "./session.table";
import { storageTable } from "./storage.table";
import { streamTable } from "./stream.table";
import { videoLikeTable } from "./video-like.table";
import { videoTable } from "./video.table";

export const userTable = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    username: text("username").notNull().unique(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull().default(false),
    hashedPassword: text("hashed_password"),
    imageUrl: text("image_url").default("").notNull(),
    bio: text("bio"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .$onUpdate(() => new Date())
        .defaultNow(),
});

export const userRelations = relations(userTable, ({ many, one }) => ({
    following: many(followTable, { relationName: "followed_users" }),
    followers: many(followTable, { relationName: "followers" }),
    blocking: many(blockTable, { relationName: "blocking" }),
    blockedBy: many(blockTable, { relationName: "blocked_by" }),
    emailVerificationCodes: many(emailVerificationTable),
    accounts: many(accountTable),
    stream: one(streamTable),
    session: one(sessionTable),
    forgetPassword: many(forgetPasswordTable),
    videos: many(videoTable),
    videolikes: many(videoLikeTable),
    comments: many(commentTable),
}));
