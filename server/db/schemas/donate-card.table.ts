import { relations } from "drizzle-orm";
import {
    boolean,
    integer,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

import { streamTable } from "./stream.table";

export const donateCardTable = pgTable("donate_cards", {
    id: uuid("id").defaultRandom().primaryKey(),
    streamId: uuid("stream_id")
        .references(() => streamTable.id)
        .notNull(),
    title: text("title").notNull(), // Tên thẻ donate (ví dụ: "Ủng hộ cà phê", "Fan cứng")
    description: text("description"), // Mô tả thẻ donate
    amount: integer("amount").notNull(), // Mệnh giá của thẻ (VND)
    imageUrl: text("image_url"), // Hình ảnh minh họa cho thẻ
    isActive: boolean("is_active").default(true).notNull(), // Trạng thái kích hoạt
    displayOrder: integer("display_order").default(0).notNull(), // Thứ tự hiển thị

    createdAt: timestamp("created_at", { mode: "string" })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
        .defaultNow()
        .notNull(),
});

export const donateCardRelations = relations(donateCardTable, ({ one }) => ({
    stream: one(streamTable, {
        fields: [donateCardTable.streamId],
        references: [streamTable.id],
    }),
}));
