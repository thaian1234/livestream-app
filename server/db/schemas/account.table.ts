import { relations } from "drizzle-orm";
import {
    pgEnum,
    pgTable,
    primaryKey,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

import { userTable } from "./user.table";

export const providerNameEnum = pgEnum("provider_id", ["google", "github"]);

export const accountTable = pgTable(
    "accounts",
    {
        providerId: providerNameEnum("provider_id").notNull(),
        providerUserId: varchar("provider_user_id", { length: 255 }).notNull(),
        userId: uuid("user_id")
            .notNull()
            .references(() => userTable.id),
    },
    (table) => {
        return {
            pk: primaryKey({
                columns: [table.providerId, table.providerUserId],
            }),
        };
    },
);

export const accountRelations = relations(accountTable, ({ one }) => ({
    user: one(userTable, {
        fields: [accountTable.userId],
        references: [userTable.id],
    }),
}));
