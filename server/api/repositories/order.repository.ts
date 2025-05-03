import { and, count, desc, eq, sql, sum } from "drizzle-orm";

import tableSchemas from "@/server/db/schemas";

import { Utils } from "../lib/helpers/utils";

import { orderTable } from "../../db/schemas/orders.table";
import { OrderDTO } from "../dtos/order.dto";
import { BaseRepository } from "./base.repository";

interface TimeRange {
    start: Date | null;
    end: Date | null;
}

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

    async getDonationStatsByStreamId(
        streamId: string,
        offset = 0,
        period = "all",
    ) {
        let timeFilter = sql`1=1`; // Default: all time

        const { start, end } = this.getTimeRange(period, offset);
        // const now = new Date();

        // if (period === "day") {
        //     timeFilter = sql`${orderTable.createdAt} >= ${new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()}`;
        // } else if (period === "week") {
        //     const weekStart = new Date(now);
        //     weekStart.setDate(now.getDate() - now.getDay());
        //     timeFilter = sql`${orderTable.createdAt} >= ${weekStart.toISOString()}`;
        // } else if (period === "month") {
        //     timeFilter = sql`${orderTable.createdAt} >= ${new Date(now.getFullYear(), now.getMonth(), 1).toISOString()}`;
        // } else if (period === "year") {
        //     timeFilter = sql`${orderTable.createdAt} >= ${new Date(now.getFullYear(), 0, 1).toISOString()}`;
        // }

        if (start && end) {
            timeFilter = sql`${orderTable.createdAt} >= ${start.toISOString()} AND ${orderTable.createdAt} <= ${end.toISOString()}`;
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

    async getPaymentMethodRankByStreamId(streamId: string, period = "all") {
        let timeFilter = sql`1=1`; // Default: all time

        const { start, end } = this.getTimeRange(period);

        if (start && end) {
            timeFilter = sql`${orderTable.createdAt} >= ${start.toISOString()} AND ${orderTable.createdAt} <= ${end.toISOString()}`;
        }

        const ranking = await this.db
            .select({
                paymentMethod: tableSchemas.orderTable.paymentMethod,
                orderCount: count(tableSchemas.orderTable.id).as("order_count"),
            })
            .from(tableSchemas.orderTable)
            .where(
                and(
                    eq(orderTable.streamId, streamId),
                    eq(orderTable.status, "COMPLETED"),
                    timeFilter,
                ),
            )
            .groupBy(tableSchemas.orderTable.paymentMethod)
            .orderBy(desc(sql`order_count`));
        return ranking;
    }

    async getDonorRankByStreamId(streamId: string, period = "all") {
        let timeFilter = sql`1=1`; // Default: all time

        const { start, end } = this.getTimeRange(period);

        if (start && end) {
            timeFilter = sql`${orderTable.createdAt} >= ${start.toISOString()} AND ${orderTable.createdAt} <= ${end.toISOString()}`;
        }

        const ranking = await this.db
            .select({
                userId: tableSchemas.orderTable.userId,
                username: tableSchemas.userTable.username,
                imageUrl: tableSchemas.userTable.imageUrl,
                donateCount: count(tableSchemas.orderTable.id).as(
                    "donate_count",
                ),
                total: sum(tableSchemas.orderTable.totalAmount).mapWith(Number).as(
                    "total_donate",
                ),
            })
            .from(tableSchemas.orderTable)
            .fullJoin(
                tableSchemas.userTable,
                eq(tableSchemas.userTable.id, tableSchemas.orderTable.userId),
            )
            .where(
                and(
                    eq(orderTable.streamId, streamId),
                    eq(orderTable.status, "COMPLETED"),
                    timeFilter,
                ),
            )
            .groupBy(
                tableSchemas.userTable.username,
                tableSchemas.orderTable.userId,
                tableSchemas.userTable.imageUrl,
            )
            .orderBy(desc(sql`total_donate`))
            .limit(5);
        return ranking;
    }

    /**
     * Return start date and end date in period range.
     */
    private getTimeRange(period: string, offset = 0, now = new Date()) {
        const ranges: Record<string, TimeRange> = {
            day: {
                start: new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate() + offset,
                ),
                end: new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate() + offset,
                    23,
                    59,
                    59,
                    999,
                ),
            },
            week: {
                start: new Date(
                    new Date(now).setDate(
                        now.getDate() - now.getDay() + offset * 7,
                    ),
                ),
                end: new Date(
                    new Date(now).setDate(
                        now.getDate() - now.getDay() + 6 + offset * 7,
                    ),
                ),
            },
            month: {
                start: new Date(now.getFullYear(), now.getMonth() + offset, 1),
                end: new Date(
                    now.getFullYear(),
                    now.getMonth() + offset + 1,
                    0,
                    23,
                    59,
                    59,
                    999,
                ),
            },
            year: {
                start: new Date(now.getFullYear() + offset, 0, 1),
                end: new Date(
                    now.getFullYear() + offset,
                    11,
                    31,
                    23,
                    59,
                    59,
                    999,
                ),
            },
            all: {
                start: null,
                end: null,
            },
        };

        // Đặt lại giờ cho week start/end
        if (period === "week" && ranges.week?.start && ranges.week?.end) {
            ranges.week.start = new Date(ranges.week.start.getTime());
            ranges.week.start.setHours(0, 0, 0, 0);
            ranges.week.end = new Date(ranges.week.end.getTime());
            ranges.week.end.setHours(23, 59, 59, 999);
        }

        return ranges[period] || { start: null, end: null };
    }
}
