import { and, desc, eq, sql } from "drizzle-orm";

import { Utils } from "../lib/helpers/utils";

import { orderTable } from "../../db/schemas/orders.table";
import { OrderDTO } from "../dtos/order.dto";
import { BaseRepository } from "./base.repository";

export interface IOrderRepository
    extends Utils.AutoMappedClass<OrderRepository> {}

export class OrderRepository
    extends BaseRepository
    implements IOrderRepository
{
    async create(data: OrderDTO.Insert) {
        const [order] = await this.db
            .insert(orderTable)
            .values(data)
            .returning();
        return order;
    }

    async findById(id: string) {
        return this.db.query.orderTable.findFirst({
            where: eq(orderTable.id, id),
        });
    }
    async findByUserId(userId: string, page = 1, size = 10) {
        const offset = (page - 1) * size;

        const results = await this.db
            .select()
            .from(orderTable)
            .where(eq(orderTable.userId, userId))
            .orderBy(desc(orderTable.createdAt))
            .limit(size)
            .offset(offset);

        const [count] = await this.db
            .select({ count: sql`count(*)`.mapWith(Number) })
            .from(orderTable)
            .where(eq(orderTable.userId, userId));

        return {
            data: results,
            meta: {
                total: count.count,
                page,
                size,
            },
        };
    }

    async findByStreamId(streamId: string, page = 1, size = 10) {
        const offset = (page - 1) * size;

        const results = await this.db
            .select()
            .from(orderTable)
            .where(eq(orderTable.streamId, streamId))
            .orderBy(desc(orderTable.createdAt))
            .limit(size)
            .offset(offset);

        const [count] = await this.db
            .select({ count: sql`count(*)` })
            .from(orderTable)
            .where(eq(orderTable.streamId, streamId));

        return {
            data: results,
            meta: {
                total: Number(count.count),
                page,
                size,
            },
        };
    }

    async update(id: string, data: OrderDTO.Update) {
        const [updated] = await this.db
            .update(orderTable)
            .set(data)
            .where(eq(orderTable.id, id))
            .returning();

        return updated;
    }

    async getDonationStatsByStreamId(streamId: string, period = "all") {
        let timeFilter = sql`1=1`; // Default: all time

        const now = new Date();

        if (period === "day") {
            timeFilter = sql`${orderTable.createdAt} >= ${new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()}`;
        } else if (period === "week") {
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay());
            timeFilter = sql`${orderTable.createdAt} >= ${weekStart.toISOString()}`;
        } else if (period === "month") {
            timeFilter = sql`${orderTable.createdAt} >= ${new Date(now.getFullYear(), now.getMonth(), 1).toISOString()}`;
        } else if (period === "year") {
            timeFilter = sql`${orderTable.createdAt} >= ${new Date(now.getFullYear(), 0, 1).toISOString()}`;
        }

        const [stats] = await this.db
            .select({
                totalDonations: sql`count(*)`.mapWith(Number),
                totalAmount: sql`sum(${orderTable.totalAmount})`.mapWith(
                    Number,
                ),
                avgAmount: sql`avg(${orderTable.totalAmount})`.mapWith(Number),
                maxAmount: sql`max(${orderTable.totalAmount})`.mapWith(Number),
                uniqueDonors: sql`count(distinct ${orderTable.userId})`.mapWith(
                    Number,
                ),
            })
            .from(orderTable)
            .where(
                and(
                    eq(orderTable.streamId, streamId),
                    eq(orderTable.status, "COMPLETED"),
                    timeFilter,
                ),
            );

        return {
            totalDonations: stats.totalDonations || 0,
            totalAmount: stats.totalAmount || 0,
            avgAmount: Math.round(stats.avgAmount || 0),
            maxAmount: stats.maxAmount || 0,
            uniqueDonors: stats.uniqueDonors || 0,
            period,
        };
    }
}
