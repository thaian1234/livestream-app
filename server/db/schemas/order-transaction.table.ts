import { relations } from "drizzle-orm";
import {
    jsonb,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

import { orderTable } from "./orders.table";

const transactionStatusEnum = pgEnum("transaction_status", [
    "CREATED",
    "PROCESSING",
    "COMPLETED",
    "FAILED",
    "REFUNDED",
]);

const orderTransactionTable = pgTable("order_transactions", {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
        .references(() => orderTable.id)
        .notNull(),
    externalTransactionId: text("external_transaction_id"), // VNPAY transaction ID
    status: transactionStatusEnum("status").default("CREATED").notNull(),
    responseCode: text("response_code"), // VNPAY response code
    responseMessage: text("response_message"), // VNPAY response message
    bankCode: text("bank_code"), // VNPAY bank code
    cardType: text("card_type"), // VNPAY card type
    rawResponse: jsonb("raw_response"), // Lưu toàn bộ response từ VNPAY

    createdAt: timestamp("created_at", { mode: "string" })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
        .defaultNow()
        .notNull(),
});

const orderTransactionRelations = relations(
    orderTransactionTable,
    ({ one }) => ({
        order: one(orderTable, {
            fields: [orderTransactionTable.orderId],
            references: [orderTable.id],
        }),
    }),
);

export {
    orderTransactionTable,
    transactionStatusEnum,
    orderTransactionRelations,
};
