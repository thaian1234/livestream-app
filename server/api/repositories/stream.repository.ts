import {
    and,
    asc,
    count,
    desc,
    eq,
    gte,
    ilike,
    inArray,
    lte,
    ne,
    notInArray,
    sql,
} from "drizzle-orm";

import Database from "@/server/db";
import tableSchemas from "@/server/db/schemas";

import { Utils } from "../lib/helpers/utils";

import { QueryDTO } from "../dtos/query.dto";
import { StreamDTO } from "../dtos/stream.dto";

export interface IStreamRepository
    extends Utils.AutoMappedClass<StreamRepository> {}

export class StreamRepository implements IStreamRepository {
    private db;
    private categorySize = 3;
    constructor() {
        this.db = Database.getInstance().db;
    }
    async advancedSearchStream(query: QueryDTO.AdvancedWithCategory) {
        const conditions = [];
        let orderBy;
        if (query.filterBy) {
            conditions.push(
                ilike(tableSchemas.streamTable.name, `%${query.filterBy}%`),
            );
        }

        if (query.dateFrom) {
            conditions.push(
                gte(tableSchemas.streamTable.createdAt, query.dateFrom),
            );
        }
        if (query.dateTo) {
            conditions.push(
                lte(tableSchemas.streamTable.createdAt, query.dateTo),
            );
        }

        if (query.isSortByCreatedAt) {
            orderBy =
                query.sortOrder &&
                query.sortOrder.toLowerCase().localeCompare("asc")
                    ? asc(tableSchemas.streamTable.createdAt)
                    : desc(tableSchemas.streamTable.createdAt);
        }

        if (query.categoryIds && query.categoryIds.length > 0) {
            conditions.push(
                inArray(
                    tableSchemas.streamTable.id,
                    this.db
                        .select({
                            id: tableSchemas.streamsToCategoriesTable.streamId,
                        })
                        .from(tableSchemas.streamsToCategoriesTable)
                        .where(
                            inArray(
                                tableSchemas.streamsToCategoriesTable
                                    .categoryId,
                                query.categoryIds,
                            ),
                        )
                        .groupBy(tableSchemas.streamsToCategoriesTable.streamId)
                        .having(
                            gte(
                                count(
                                    tableSchemas.streamsToCategoriesTable
                                        .categoryId,
                                ),
                                query.categoryIds.length,
                            ),
                        ),
                ),
            );
        }

        conditions.push(
            inArray(
                tableSchemas.streamTable.id,
                this.getStreamSettingSubQuery(),
            ),
        );

        const result = await this.db.query.streamTable.findMany({
            where: and(...conditions),
            extras(fields, operators) {
                return {
                    username:
                        sql`(SELECT username::text FROM users WHERE users.id = ${fields.userId})`.as(
                            "username",
                        ),
                    avatar: sql`(SELECT image_url::text from users WHERE users.id = ${fields.userId})`.as(
                        "avatar",
                    ),
                };
            },
            with: {
                streamsToCategories: {
                    orderBy: desc(
                        tableSchemas.streamsToCategoriesTable.createdAt,
                    ),
                    limit: this.categorySize,
                    with: {
                        category: true,
                    },
                },
            },
            limit: query.size,
            offset: query.size * (query.page - 1),
            orderBy: orderBy,
        });

        const totalRecords = await this.db.$count(
            tableSchemas.streamTable,
            and(...conditions),
        );
        return { result, totalRecords };
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
    private getStreamSettingSubQuery() {
        const settingSubQuery = this.db
            .select({
                streamId: tableSchemas.settingTable.streamId,
            })
            .from(tableSchemas.settingTable);
        return settingSubQuery;
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
                    streamsToCategories: {
                        with: {
                            category: true,
                        },
                        limit: this.categorySize,
                    },
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
                orderBy: sql`md5(id::text || date_trunc('hour', now())::text)`,
            });
            const totalRecords = await this.db.$count(
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
            return { streams, totalRecords };
        } catch (error) {}
    }
    public async getRecommendedStreams(offset: number = 0, limit: number = 10) {
        try {
            const streams = await this.db.query.streamTable.findMany({
                with: {
                    user: true,
                    streamsToCategories: {
                        with: {
                            category: true,
                        },
                        limit: this.categorySize,
                    },
                },
                offset: offset,
                limit: limit,
                orderBy: sql`md5(id::text || date_trunc('hour', now())::text)`,
            });
            const totalRecords = await this.db.$count(tableSchemas.streamTable);

            return { streams, totalRecords };
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
                    streamsToCategories: {
                        with: {
                            category: true,
                        },
                        limit: this.categorySize,
                    },
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
            const totalRecords = await this.db.$count(
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
            return { streams, totalRecords };
        } catch (error) {}
    }
    public async getStreamCategories(streamId: string) {
        try {
            const categories =
                await this.db.query.streamsToCategoriesTable.findMany({
                    where: eq(
                        tableSchemas.streamsToCategoriesTable.streamId,
                        streamId,
                    ),
                    with: {
                        category: true,
                    },
                });
            return categories;
        } catch (error) {
            console.error(error);
        }
    }
}
