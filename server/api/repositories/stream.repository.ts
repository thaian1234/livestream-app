import { StreamDTO } from "../dtos/stream.dto";
import PaginationHelper from "../lib/helpers/pagination";
import { Utils } from "../lib/helpers/utils";
import {
    and,
    asc,
    desc,
    eq,
    gte,
    inArray,
    lte,
    ne,
    notInArray,
    sql,
} from "drizzle-orm";

import Database from "@/server/db";
import tableSchemas from "@/server/db/schemas";

export interface IStreamRepository
    extends Utils.AutoMappedClass<StreamRepository> {}

export class StreamRepository implements IStreamRepository {
    private db;
    constructor() {
        this.db = Database.getInstance().db;
    }
    async advancedSearchStream(
        name: string = "",
        dateFrom: Date = new Date("2000-01-01"),
        dateTo: Date = new Date(),
        isSortByCreatedAt: boolean = false,
        sortOrder: string = "asc",
        offset: number = 0,
        limit: number = 10,
    ) {
        const conditions = [];
        let orderBy;
        if (name) {
            conditions.push(
                sql`to_tsvector('simple', ${tableSchemas.streamTable.name}) @@ to_tsquery(${name})`,
            );
        }

        if (dateFrom) {
            conditions.push(gte(tableSchemas.streamTable.createdAt, dateFrom));
        }
        if (dateTo) {
            conditions.push(lte(tableSchemas.streamTable.createdAt, dateTo));
        }

        if (isSortByCreatedAt) {
            orderBy = sortOrder.toLowerCase().localeCompare("asc")
                ? asc(tableSchemas.streamTable.createdAt)
                : desc(tableSchemas.streamTable.createdAt);
        }
        const result = await this.db.query.streamTable.findMany({
            where: and(...conditions),
            limit: limit,
            offset: offset,
            orderBy: orderBy,
        });
        return result;
    }
    async getStreamByUserId(userId: string) {
        const result = await this.db.query.streamTable.findFirst({
            where: eq(tableSchemas.streamTable.userId, userId),
        });
        return result;
    }
    public async createOne(streamData: StreamDTO.Insert) {
        try {
            return this.db.transaction(async (tx) => {
                const [stream] = await this.db
                    .insert(tableSchemas.streamTable)
                    .values(streamData)
                    .onConflictDoUpdate({
                        set: streamData,
                        target: tableSchemas.streamTable.id,
                    })
                    .returning();

                if (!stream) {
                    tx.rollback();
                    return;
                }
                const [setting] = await this.db
                    .insert(tableSchemas.settingTable)
                    .values({
                        streamId: stream.id,
                    })
                    .returning();
                if (!setting) {
                    tx.rollback();
                    return;
                }
                return stream;
            });
        } catch (error) {}
    }
    public async getStreamWithSetting(userId: string) {
        try {
            const stream = await this.db.query.streamTable.findFirst({
                where: eq(tableSchemas.streamTable.userId, userId),
                with: {
                    setting: true,
                },
            });
            return stream;
        } catch (error) {}
    }
    async update(id: string, data: StreamDTO.Update) {
        try {
            const [stream] = await this.db
                .update(tableSchemas.streamTable)
                .set(data)
                .where(eq(tableSchemas.streamTable.id, id))
                .returning();
            return stream;
        } catch (error) {}
    }

    private getBlockedSubQuery(userId: string) {
        const blockedSubQuery = this.db
            .select({
                blockedId: tableSchemas.blockTable.blockedId,
            })
            .from(tableSchemas.blockTable)
            .where(eq(tableSchemas.blockTable.blockerId, userId));
        return blockedSubQuery;
    }

    private getBlockerSubQuery(userId: string) {
        const blockerSubQuery = this.db
            .select({
                blockerId: tableSchemas.blockTable.blockerId,
            })
            .from(tableSchemas.blockTable)
            .where(eq(tableSchemas.blockTable.blockedId, userId));
        return blockerSubQuery;
    }
    private getFollowingSubQuery(userId: string) {
        const followersSubQuery = this.db
            .select({
                followedId: tableSchemas.followTable.followedId,
            })
            .from(tableSchemas.followTable)
            .where(eq(tableSchemas.followTable.followerId, userId));
        return followersSubQuery;
    }
    public async getRecommendedStreamsByUserId(
        userId: string,
        offset: number = 0,
        limit: number = 10,
    ) {
        try {
            const streams = await this.db.query.streamTable.findMany({
                with: {
                    user: true,
                },
                where: and(
                    ne(tableSchemas.streamTable.userId, userId),
                    notInArray(
                        tableSchemas.streamTable.userId,
                        this.getBlockedSubQuery(userId),
                    ),
                    notInArray(
                        tableSchemas.streamTable.userId,
                        this.getBlockerSubQuery(userId),
                    ),
                ),
                offset: offset,
                limit: limit,
                orderBy: sql`RANDOM()`,
            });
            const totalCount = await this.db.$count(
                tableSchemas.streamTable,
                and(
                    ne(tableSchemas.streamTable.userId, userId),
                    notInArray(
                        tableSchemas.streamTable.userId,
                        this.getBlockedSubQuery(userId),
                    ),
                    notInArray(
                        tableSchemas.streamTable.userId,
                        this.getBlockerSubQuery(userId),
                    ),
                ),
            );
            return { streams, totalCount };
        } catch (error) {}
    }
    public async getRecommendedStreams(offset: number = 0, limit: number = 10) {
        try {
            const streams = await this.db.query.streamTable.findMany({
                with: {
                    user: true,
                },
                offset: offset,
                limit: limit,
                orderBy: sql`RANDOM()`,
            });
            const totalCount = await this.db.$count(tableSchemas.streamTable);

            return { streams, totalCount };
        } catch (error) {}
    }
    public async getFollowingStreamsByUserId(
        userId: string,
        offset: number = 0,
        limit: number = 10,
    ) {
        try {
            const streams = await this.db.query.streamTable.findMany({
                with: {
                    user: true,
                },
                where: and(
                    ne(tableSchemas.streamTable.userId, userId),
                    notInArray(
                        tableSchemas.streamTable.userId,
                        this.getBlockedSubQuery(userId),
                    ),
                    notInArray(
                        tableSchemas.streamTable.userId,
                        this.getBlockerSubQuery(userId),
                    ),
                    inArray(
                        tableSchemas.streamTable.userId,
                        this.getFollowingSubQuery(userId),
                    ),
                ),
                offset: offset,
                limit: limit,
            });
            const totalCount = await this.db.$count(
                tableSchemas.streamTable,
                and(
                    ne(tableSchemas.streamTable.userId, userId),
                    notInArray(
                        tableSchemas.streamTable.userId,
                        this.getBlockedSubQuery(userId),
                    ),
                    notInArray(
                        tableSchemas.streamTable.userId,
                        this.getBlockerSubQuery(userId),
                    ),
                    inArray(
                        tableSchemas.streamTable.userId,
                        this.getFollowingSubQuery(userId),
                    ),
                ),
            );
            return { streams, totalCount };
        } catch (error) {}
    }
}
