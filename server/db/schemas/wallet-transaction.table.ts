import { relations } from "drizzle-orm";
import {
    integer,
    jsonb,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

import { orderTable } from "./orders.table";
import { walletTable } from "./wallet.table";

export const transactionTypeEnum = pgEnum("transaction_type", [
    "DEPOSIT", // Nạp tiền vào ví (từ external payment)
    "WITHDRAWAL", // Rút tiền từ ví
    "DONATION_SENT", // Gửi donation (trừ tiền từ ví donor)
    "DONATION_RECEIVED", // Nhận donation (cộng tiền vào ví streamer)
    "FEE", // Phí platform
    "SYSTEM_ADJUSTMENT", // Điều chỉnh hệ thống
]);

export const walletTransactionTable = pgTable("wallet_transactions", {
    id: uuid("id").defaultRandom().primaryKey(),
    walletId: uuid("wallet_id")
        .references(() => walletTable.id)
        .notNull(),
    amount: integer("amount").notNull(), // Transaction amount (can be positive or negative)
    type: transactionTypeEnum("type").notNull(),
    description: text("description"),
    balanceBefore: integer("balance_before").notNull(), // Balance before transaction
    balanceAfter: integer("balance_after").notNull(), // Balance after transaction
    orderId: uuid("order_id").references(() => orderTable.id), // Related order (if applicable)
    referenceId: text("reference_id"), // Reference ID (e.g., withdrawal transaction ID)
    metadata: jsonb("metadata"), // Additional information

    createdAt: timestamp("created_at", { mode: "string" })
        .defaultNow()
        .notNull(),
});

export const walletTransactionRelations = relations(
    walletTransactionTable,
    ({ one }) => ({
        wallet: one(walletTable, {
            fields: [walletTransactionTable.walletId],
            references: [walletTable.id],
        }),
        order: one(orderTable, {
            fields: [walletTransactionTable.orderId],
            references: [orderTable.id],
        }),
    }),
);
