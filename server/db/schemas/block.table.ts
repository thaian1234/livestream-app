import { relations } from "drizzle-orm";
import { index, pgTable, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";



import { userTable } from "./user.table";


export const blockTable = pgTable(
    "blocks",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        blockerId: uuid("blocker_id")
            .notNull()
            .references(() => userTable.id, { onDelete: "cascade" }),
        blockedId: uuid("blocked_id")
            .notNull()
            .references(() => userTable.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .$onUpdate(() => new Date())
            .defaultNow(),
    },
    (table) => ({
        unq: uniqueIndex("blocker_blocked_unq").on(
            table.blockerId,
            table.blockedId,
        ),
        blockerIdx: index("blocker_idx").on(table.blockerId),
        blockedIdx: index("blocked_idx").on(table.blockedId),
    }),
);

export const blockRelations = relations(blockTable, ({ one }) => ({
    blocker: one(userTable, {
        fields: [blockTable.blockerId],
        references: [userTable.id],
        relationName: "blocking",
    }),
    blocked: one(userTable, {
        fields: [blockTable.blockedId],
        references: [userTable.id],
        relationName: "blocked_by",
    }),
}));