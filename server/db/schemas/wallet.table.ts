import { relations } from "drizzle-orm";
import { integer, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

import { userTable } from "./user.table";

export const walletTable = pgTable("wallets", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .references(() => userTable.id)
        .notNull()
        .unique(),
    balance: integer("balance").default(0).notNull(), // Current balance (VND)
    pendingBalance: integer("pending_balance").default(0).notNull(), // Pending balance
    totalReceived: integer("total_received").default(0).notNull(), // Total received
    totalWithdrawn: integer("total_withdrawn").default(0).notNull(), // Total withdrawn
    createdAt: timestamp("created_at", { mode: "string" })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
        .defaultNow()
        .$onUpdate(() => new Date().toISOString())
        .notNull(),
    lastTransactionAt: timestamp("last_transaction_at", { mode: "string" }),
});

export const walletRelations = relations(walletTable, ({ one }) => ({
    user: one(userTable, {
        fields: [walletTable.userId],
        references: [userTable.id],
    }),
}));
