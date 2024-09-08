import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { userTable } from "./user.table";

export const emailVerificationTable = pgTable("email_verification_codes", {
    id: uuid("id").primaryKey().defaultRandom(),
    code: varchar("code", {
        length: 8,
    }).notNull(),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date",
    }).notNull(),
    userId: uuid("user_id")
        .notNull()
        .unique()
        .references(() => userTable.id),
});

export const emailVerificationRelations = relations(
    emailVerificationTable,
    ({ one }) => ({
        user: one(userTable, {
            fields: [emailVerificationTable.userId],
            references: [userTable.id],
        }),
    }),
);
