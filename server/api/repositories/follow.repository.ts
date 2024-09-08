import { Utils } from "../lib/helpers/utils";
import {
    FollowValidation,
    UserValidation,
} from "../lib/validations/schema.validation";
import { and, desc, eq, ne, notInArray } from "drizzle-orm";

import Database from "@/server/db";
import tableSchemas from "@/server/db/schemas";
import { followTable } from "@/server/db/schemas/follow.table";

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
            const followings = await this.db.query.followTable.findMany({
                where: and(
                    eq(tableSchemas.followTable.followerId, userId),
                    notInArray(
                        tableSchemas.followTable.followedId,
                        this.db
                            .select({
                                blockedId: tableSchemas.blockTable.blockedId,
                            })
                            .from(tableSchemas.blockTable)
                            .where(
                                eq(tableSchemas.blockTable.blockerId, userId),
                            ),
                    ),
                ),
                with: {
                    following: true,
                },
                offset: offset,
                limit: limit,
                orderBy: desc(tableSchemas.followTable.createdAt),
            });
            return followings;
        } catch (error) {}
    }

    async findFollowerByUserId(
        userId: string,
        offset: number = 0,
        limit: number = 10,
    ) {
        try {
            const followers = await this.db.query.followTable.findMany({
                where: and(
                    eq(tableSchemas.followTable.followedId, userId),
                    notInArray(
                        tableSchemas.followTable.followerId,
                        this.db
                            .select({
                                blockedId: tableSchemas.blockTable.blockedId,
                            })
                            .from(tableSchemas.blockTable)
                            .where(
                                eq(tableSchemas.blockTable.blockerId, userId),
                            ),
                    ),
                ),
                with: {
                    follower: true,
                },
                offset: offset,
                limit: limit,
                orderBy: desc(tableSchemas.followTable.createdAt),
            });
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
            });
            return recommends;
        } catch (error) {}
    }

    async create(data: FollowValidation.Insert) {
        try {
            const follow = await this.db
                .insert(tableSchemas.followTable)
                .values(data)
                .returning();
            return follow[0];
        } catch (error) {}
    }

    async delete(data: FollowValidation.Delete) {
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
}
