import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { userTable } from "./user.table";

export const forgetPasswordTable = pgTable("forget-passwords", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .unique()
        .references(() => userTable.id),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date",
    }),
});

export const forgetPasswordRelations = relations(
    forgetPasswordTable,
    ({ one }) => ({
        user: one(userTable, {
            fields: [forgetPasswordTable.userId],
            references: [userTable.id],
        }),
    }),
);
