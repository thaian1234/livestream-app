import { relations } from "drizzle-orm";
import {
    pgEnum,
    pgTable,
    primaryKey,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

import { userTable } from "./user.table";

export const providerNameEnum = pgEnum("provider_name", ["google", "github"]);

export const accountTable = pgTable(
    "account",
    {
        providerId: varchar("provider_id", { length: 255 }).notNull(),
        providerUserId: varchar("provider_user_id", { length: 255 }).notNull(),
        providerName: providerNameEnum("provider_name"),
        userId: uuid("user_id")
            .notNull()
            .references(() => userTable.id),
    },
    (table) => {
        return {
            pk: primaryKey({
                columns: [table.providerId, table.userId],
            }),
        };
    },
);

export const accountRelations = relations(accountTable, ({ one }) => ({
    user: one(accountTable),
}));
