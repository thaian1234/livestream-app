import { relations } from "drizzle-orm";
import {
    integer,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

import { orderTransactionTable } from "./order-transaction.table";
import { streamTable } from "./stream.table";
import { userTable } from "./user.table";
import { walletTransactionTable } from "./wallet-transaction.table";

const orderStatusEnum = pgEnum("order_status", [
    "PENDING",
    "PROCESSING",
    "COMPLETED",
    "FAILED",
    "CANCELLED",
]);

const paymentMethodEnum = pgEnum("payment_method", [
    "VNPAY",
    "MOMO",
    "ZALOPAY",
    "WALLET",
]);

const orderTable = pgTable("orders", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .references(() => userTable.id)
        .notNull(),
    streamId: uuid("stream_id")
        .references(() => streamTable.id)
        .notNull(),
    totalAmount: integer("total_amount").notNull(), // Tổng số tiền
    status: orderStatusEnum("status").default("PENDING").notNull(),
    message: text("message"), // Tin nhắn kèm theo
    paymentMethod: paymentMethodEnum().default("VNPAY").notNull(),
    externalTransactionId: text("external_transaction_id"), // ID giao dịch từ cổng thanh toán
    ipAddress: text("ip_address"), // Địa chỉ IP của người dùng

    createdAt: timestamp("created_at", { mode: "string" })
        .defaultNow()
        .notNull(),

    updatedAt: timestamp("updated_at", { mode: "string" })
        .defaultNow()
        .$onUpdate(() => new Date().toISOString())
        .notNull(),
    completedAt: timestamp("completed_at", { mode: "string" }), // Thời điểm hoàn thành
});

const orderRelations = relations(orderTable, ({ one, many }) => ({
    user: one(userTable, {
        fields: [orderTable.userId],
        references: [userTable.id],
    }),
    stream: one(streamTable, {
        fields: [orderTable.streamId],
        references: [streamTable.id],
    }),
    orderTransactions: many(orderTransactionTable),
    walletTransactions: many(walletTransactionTable),
}));

export { orderTable, orderRelations, orderStatusEnum, paymentMethodEnum };
