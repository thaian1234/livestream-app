import { and, desc, eq, inArray, ne, notInArray, sql } from "drizzle-orm";

import Database from "@/server/db";
import tableSchemas from "@/server/db/schemas";

import { Utils } from "../lib/helpers/utils";

import { FollowDTO } from "../dtos/follow.dto";

export interface IFollowRepository
    extends Utils.AutoMappedClass<FollowRepository> {}

export class FollowRepository implements IFollowRepository {
    private db;
    constructor() {
        this.db = Database.getInstance().db;
    }

    async findFollowingByUserId(
        userId: string,
        offset: number = 0,
        limit: number = 10,
    ) {
        try {
            const followings = await this.db
                .select({
                    id: tableSchemas.userTable.id,
                    username: tableSchemas.userTable.username,
                    email: tableSchemas.userTable.email,
                    emailVerified: tableSchemas.userTable.emailVerified,
                    imageUrl: tableSchemas.userTable.imageUrl,
                    createdAt: tableSchemas.followTable.createdAt,
                })
                .from(tableSchemas.userTable)
                .innerJoin(
                    tableSchemas.followTable,
                    eq(
                        tableSchemas.userTable.id,
                        tableSchemas.followTable.followedId,
                    ),
                )
                .where(
                    and(
                        ne(tableSchemas.userTable.id, userId),
                        eq(tableSchemas.followTable.followerId, userId),
                        // current user and get user Not in the block relationship
                        // check if get user being blocked by current user
                        notInArray(
                            tableSchemas.userTable.id,
                            this.db
                                .select({
                                    blockedId:
                                        tableSchemas.blockTable.blockedId,
                                })
                                .from(tableSchemas.blockTable)
                                .where(
                                    eq(
                                        tableSchemas.blockTable.blockerId,
                                        userId,
                                    ),
                                ),
                        ),
                        // check if current user being blocked
                        notInArray(
                            tableSchemas.userTable.id,
                            this.db
                                .select({
                                    blockerId:
                                        tableSchemas.blockTable.blockerId,
                                })
                                .from(tableSchemas.blockTable)
                                .where(
                                    eq(
                                        tableSchemas.blockTable.blockedId,
                                        userId,
                                    ),
                                ),
                        ),
                    ),
                )
                .limit(limit)
                .offset(offset);
            return followings;
        } catch (error) {}
    }

    async findFollowerByUserId(
        userId: string,
        offset: number = 0,
        limit: number = 10,
    ) {
        try {
            const followers = await this.db
                .select({
                    id: tableSchemas.userTable.id,
                    username: tableSchemas.userTable.username,
                    email: tableSchemas.userTable.email,
                    emailVerified: tableSchemas.userTable.emailVerified,
                    imageUrl: tableSchemas.userTable.imageUrl,
                    createdAt: tableSchemas.followTable.createdAt,
                })
                .from(tableSchemas.userTable)
                .innerJoin(
                    tableSchemas.followTable,
                    eq(
                        tableSchemas.userTable.id,
                        tableSchemas.followTable.followerId,
                    ),
                )
                .where(
                    and(
                        ne(tableSchemas.userTable.id, userId),
                        eq(tableSchemas.followTable.followedId, userId),
                        // current user and get user Not in the block relationship
                        // check if get user being blocked by current user
                        notInArray(
                            tableSchemas.userTable.id,
                            this.db
                                .select({
                                    blockedId:
                                        tableSchemas.blockTable.blockedId,
                                })
                                .from(tableSchemas.blockTable)
                                .where(
                                    eq(
                                        tableSchemas.blockTable.blockerId,
                                        userId,
                                    ),
                                ),
                        ),
                        // check if current user being blocked
                        notInArray(
                            tableSchemas.userTable.id,
                            this.db
                                .select({
                                    blockerId:
                                        tableSchemas.blockTable.blockerId,
                                })
                                .from(tableSchemas.blockTable)
                                .where(
                                    eq(
                                        tableSchemas.blockTable.blockedId,
                                        userId,
                                    ),
                                ),
                        ),
                    ),
                )
                .limit(limit)
                .offset(offset);
            return followers;
        } catch (error) {}
    }

    async findRecommendByUserId(
        userId: string,
        offset: number = 0,
        limit: number = 10,
    ) {
        try {
            const recommends = await this.db.query.userTable.findMany({
                where: and(
                    ne(tableSchemas.userTable.id, userId),
                    notInArray(
                        tableSchemas.userTable.id,
                        this.db
                            .select({
                                blockedId: tableSchemas.blockTable.blockedId,
                            })
                            .from(tableSchemas.blockTable)
                            .where(
                                eq(tableSchemas.blockTable.blockerId, userId),
                            ),
                    ),
                    notInArray(
                        tableSchemas.userTable.id,
                        this.db
                            .select({
                                followedId: tableSchemas.followTable.followedId,
                            })
                            .from(tableSchemas.followTable)
                            .where(
                                eq(tableSchemas.followTable.followerId, userId),
                            ),
                    ),
                ),
                offset: offset,
                limit: limit,
                orderBy: sql`RANDOM()`,
            });
            return recommends;
        } catch (error) {}
    }

    async create(data: FollowDTO.Insert) {
        try {
            const follow = await this.db
                .insert(tableSchemas.followTable)
                .values(data)
                .returning();
            return follow[0];
        } catch (error) {}
    }

    async delete(data: FollowDTO.Delete) {
        try {
            const rows = await this.db
                .delete(tableSchemas.followTable)
                .where(
                    and(
                        eq(
                            tableSchemas.followTable.followerId,
                            data.followerId,
                        ),
                        eq(
                            tableSchemas.followTable.followedId,
                            data.followedId,
                        ),
                    ),
                )
                .returning();
            if (rows.length == 0) {
                return false;
            }
            return true;
        } catch (error) {}
    }

    async findByFollowerAndFollowed(followerId: string, followedId: string) {
        try {
            const followings = await this.db.query.followTable.findFirst({
                where: and(
                    eq(tableSchemas.followTable.followerId, followerId),
                    eq(tableSchemas.followTable.followedId, followedId),
                ),
            });
            return followings;
        } catch (error) {}
    }

    async findRecommend(offset: number = 0, limit: number = 10) {
        try {
            const recommends = await this.db.query.userTable.findMany({
                offset: offset,
                limit: limit,
                orderBy: sql`RANDOM()`,
            });
            return recommends;
        } catch (error) {}
    }
}
