import { and, desc, eq, sql } from "drizzle-orm";

import tableSchemas from "@/server/db/schemas";

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
            with: {
                user: true,
            },
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

    async getTopDonorsByStreamId(streamId: string, period = "all", limit = 5) {
        let timeFilter = sql`1=1`;

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

        const topDonors = await this.db
            .select({
                userId: orderTable.userId,
                totalAmount: sql`sum(${orderTable.totalAmount})`.mapWith(
                    Number,
                ),
                donationCount: sql`count(*)`.mapWith(Number),
            })
            .from(orderTable)
            .where(
                and(
                    eq(orderTable.streamId, streamId),
                    eq(orderTable.status, "COMPLETED"),
                    timeFilter,
                ),
            )
            .groupBy(orderTable.userId)
            .orderBy(desc(sql`sum(${orderTable.totalAmount})`))
            .limit(limit);

        const donorsWithDetails = await Promise.all(
            topDonors.map(async (donor) => {
                const user = await this.db.query.userTable.findFirst({
                    where: eq(tableSchemas.userTable.id, donor.userId),
                    columns: {
                        id: true,
                        username: true,
                        imageUrl: true,
                    },
                });

                return {
                    id: donor.userId,
                    name: user?.username || "Anonymous",
                    totalAmount: donor.totalAmount,
                    donationCount: donor.donationCount,
                    imageUrl: user?.imageUrl || "",
                };
            }),
        );

        return donorsWithDetails;
    }

    async getPaymentMethodStatsByStreamId(streamId: string, period = "all") {
        let timeFilter = sql`1=1`;

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

        const [totalCount] = await this.db
            .select({
                count: sql`count(*)`.mapWith(Number),
            })
            .from(orderTable)
            .where(
                and(
                    eq(orderTable.streamId, streamId),
                    eq(orderTable.status, "COMPLETED"),
                    timeFilter,
                ),
            );

        const methodStats = await this.db
            .select({
                method: orderTable.paymentMethod,
                count: sql`count(*)`.mapWith(Number),
            })
            .from(orderTable)
            .where(
                and(
                    eq(orderTable.streamId, streamId),
                    eq(orderTable.status, "COMPLETED"),
                    timeFilter,
                ),
            )
            .groupBy(orderTable.paymentMethod)
            .orderBy(desc(sql`count(*)`));

        // Calculate percentages
        const total = totalCount.count || 1;
        return methodStats.map((stat) => ({
            method: stat.method || "Unknown",
            count: stat.count,
            percentage: Math.round((stat.count / total) * 100),
        }));
    }

    async getHighestDonationByStreamId(streamId: string, period = "all") {
        let timeFilter = sql`1=1`;

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

        // Find the highest donation
        const [highestDonation] = await this.db
            .select({
                id: orderTable.id,
                amount: orderTable.totalAmount,
                userId: orderTable.userId,
                date: orderTable.createdAt,
            })
            .from(orderTable)
            .where(
                and(
                    eq(orderTable.streamId, streamId),
                    eq(orderTable.status, "COMPLETED"),
                    timeFilter,
                ),
            )
            .orderBy(desc(orderTable.totalAmount))
            .limit(1);

        if (!highestDonation) {
            return {
                amount: 0,
                donor: "No donations yet",
                date: new Date().toISOString(),
            };
        }

        // Get donor details
        const donor = await this.db.query.userTable.findFirst({
            where: eq(tableSchemas.userTable.id, highestDonation.userId),
            columns: {
                username: true,
            },
        });

        return {
            amount: highestDonation.amount,
            donor: donor?.username || "Anonymous",
            date: highestDonation.date,
        };
    }

    async getPeriodComparisonByStreamId(
        streamId: string,
        currentPeriod = "month",
        previousPeriod = "last_month",
    ) {
        // Get current period stats
        const currentStats = await this.getDonationStatsByStreamId(
            streamId,
            currentPeriod,
        );

        // For previous period, we need to calculate the date range
        let previousTimeFilter;
        const now = new Date();

        if (previousPeriod === "last_month") {
            const lastMonth = new Date(
                now.getFullYear(),
                now.getMonth() - 1,
                1,
            );
            const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

            previousTimeFilter = and(
                sql`${orderTable.createdAt} >= ${lastMonth.toISOString()}`,
                sql`${orderTable.createdAt} <= ${lastMonthEnd.toISOString()}`,
            );
        } else if (previousPeriod === "last_week") {
            const twoWeeksAgo = new Date(now);
            twoWeeksAgo.setDate(now.getDate() - 14);

            const oneWeekAgo = new Date(now);
            oneWeekAgo.setDate(now.getDate() - 7);

            previousTimeFilter = and(
                sql`${orderTable.createdAt} >= ${twoWeeksAgo.toISOString()}`,
                sql`${orderTable.createdAt} <= ${oneWeekAgo.toISOString()}`,
            );
        } else {
            // Default to previous month
            const lastMonth = new Date(
                now.getFullYear(),
                now.getMonth() - 1,
                1,
            );
            const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

            previousTimeFilter = and(
                sql`${orderTable.createdAt} >= ${lastMonth.toISOString()}`,
                sql`${orderTable.createdAt} <= ${lastMonthEnd.toISOString()}`,
            );
        }

        // Get previous period stats
        const [previousStats] = await this.db
            .select({
                totalDonations: sql`count(*)`.mapWith(Number),
                totalAmount: sql`sum(${orderTable.totalAmount})`.mapWith(
                    Number,
                ),
                avgAmount: sql`avg(${orderTable.totalAmount})`.mapWith(Number),
                uniqueDonors: sql`count(distinct ${orderTable.userId})`.mapWith(
                    Number,
                ),
            })
            .from(orderTable)
            .where(
                and(
                    eq(orderTable.streamId, streamId),
                    eq(orderTable.status, "COMPLETED"),
                    previousTimeFilter,
                ),
            );

        return {
            current: {
                period: currentPeriod,
                totalDonations: currentStats.totalDonations,
                totalAmount: currentStats.totalAmount,
                avgAmount: currentStats.avgAmount,
                uniqueDonors: currentStats.uniqueDonors,
            },
            previous: {
                period: previousPeriod,
                totalDonations: previousStats.totalDonations || 0,
                totalAmount: previousStats.totalAmount || 0,
                avgAmount: Math.round(previousStats.avgAmount || 0),
                uniqueDonors: previousStats.uniqueDonors || 0,
            },
        };
    }

    async getCompleteDonationAnalysis(streamId: string, period = "all") {
        const [stats, topDonors, paymentMethodStats, highestDonation] =
            await Promise.all([
                this.getDonationStatsByStreamId(streamId, period),
                this.getTopDonorsByStreamId(streamId, period, 5),
                this.getPaymentMethodStatsByStreamId(streamId, period),
                this.getHighestDonationByStreamId(streamId, period),
            ]);

        // Get comparison with previous period
        let previousPeriod;
        if (period === "month") {
            previousPeriod = "last_month";
        } else if (period === "week") {
            previousPeriod = "last_week";
        } else {
            previousPeriod = "last_month"; // Default
        }

        const comparison =
            period !== "all"
                ? await this.getPeriodComparisonByStreamId(
                      streamId,
                      period,
                      previousPeriod,
                  )
                : null;

        return {
            totalDonations: stats?.totalDonations,
            totalAmount: stats.totalAmount,
            lastTotalAmount: comparison?.previous.totalAmount,
            totalDonors: stats.uniqueDonors,
            lastTotalDonors: comparison?.previous.uniqueDonors,
            averageDonation: stats.avgAmount,
            lastAverageDonation: comparison?.previous.avgAmount,
            highestDonation,
            topDonors,
            paymentMethodStats,
            period,
        };
    }
}
