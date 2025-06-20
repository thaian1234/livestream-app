import { and, asc, count, desc, eq, inArray, ne, sql } from "drizzle-orm";

import Database from "@/server/db";
import tableSchemas from "@/server/db/schemas";
import { videosToCategoriesRelations } from "@/server/db/schemas/video-category.table";

import { Utils } from "../lib/helpers/utils";

import { VideoDTO } from "../dtos/video.dto";

export interface IVideoRepository
    extends Utils.AutoMappedClass<VideoRepository> {}

export class VideoRepository implements IVideoRepository {
    private db;
    private categorySize = 3;
    constructor() {
        this.db = Database.getInstance().db;
    }
    private getLikeAndDislikeCount() {
        return {
            likeCount:
                sql`(SELECT COUNT(*) FROM "videoLikes" vl WHERE vl."videoId" = "videoTable"."id" AND vl."type" = 1)`.as(
                    "likeCount",
                ),
            dislikeCount:
                sql`(SELECT COUNT(*) FROM "videoLikes" vl WHERE vl."videoId" = "videoTable"."id" AND vl."type" = -1)`.as(
                    "dislikeCount",
                ),
        };
    }
    async findById(id: string) {
        try {
            const video = await this.db.query.videoTable.findFirst({
                where: eq(tableSchemas.videoTable.id, id),
                with: {
                    user: true,
                    videosToCategories: {
                        with: {
                            category: true,
                        },
                        limit: this.categorySize,
                    },
                    videoLikes: true,
                },
                extras: this.getLikeAndDislikeCount(),
            });
            return video;
        } catch (error) {
            console.error(error);
        }
    }
    async findByUserId(userId: string, offset: number, size: number) {
        try {
            const videos = await this.db.query.videoTable.findMany({
                where: eq(tableSchemas.videoTable.userId, userId),
                extras: this.getLikeAndDislikeCount(),
                offset: offset,
                limit: size,
                orderBy: [
                    desc(tableSchemas.videoTable.createdAt),
                    asc(tableSchemas.videoTable.title),
                ],
            });
            const totalRecords = await this.db.$count(
                tableSchemas.videoTable,
                eq(tableSchemas.videoTable.userId, userId),
            );
            return { videos, totalRecords };
        } catch (error) {
            console.error(error);
        }
    }
    async findAll() {
        try {
            const videos = await this.db.query.videoTable.findMany({
                extras: this.getLikeAndDislikeCount(),
            });
            return videos;
        } catch (error) {
            console.error(error);
        }
    }
    async create(data: VideoDTO.Insert) {
        try {
            const video = await this.db.transaction(async (tx) => {
                const [video] = await tx
                    .insert(tableSchemas.videoTable)
                    .values(data)
                    .returning();
                return video;
            });
            return video;
        } catch (error) {
            console.error(error);
        }
    }
    async update(id: string, data: VideoDTO.Update) {
        try {
            const video = await this.db
                .update(tableSchemas.videoTable)
                .set(data)
                .where(eq(tableSchemas.videoTable.id, id))
                .returning();
            return video[0];
        } catch (error) {
            console.error(error);
        }
    }
    async delete(id: string) {
        try {
            return await this.db
                .delete(tableSchemas.videoTable)
                .where(eq(tableSchemas.videoTable.id, id));
        } catch (error) {
            console.error(error);
        }
    }
    public async getVideoCategories(videoId: string) {
        try {
            const categories =
                await this.db.query.videosToCategoriesTable.findMany({
                    where: eq(
                        tableSchemas.videosToCategoriesTable.videoId,
                        videoId,
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
    async checkOwnVideo(userId: string, videoId: string) {
        try {
            const isOwn = !!(await this.db.query.videoTable.findFirst({
                where: and(
                    eq(tableSchemas.videoTable.id, videoId),
                    eq(tableSchemas.videoTable.userId, userId),
                ),
            }));
            return isOwn;
        } catch (error) {}
    }
    async getRelateVideo(videoId: string) {
        try {
            // Get categories of the current video
            const categories = await this.db
                .select({
                    categoryId: tableSchemas.videosToCategoriesTable.categoryId,
                })
                .from(tableSchemas.videosToCategoriesTable)
                .where(
                    eq(tableSchemas.videosToCategoriesTable.videoId, videoId),
                );

            if (categories.length === 0) {
                return this.db
                    .select()
                    .from(tableSchemas.videoTable)
                    .where(
                        ne(tableSchemas.videoTable.id, videoId), // Exclude current video
                    )
                    .orderBy(sql`RANDOM()`)
                    .limit(5);
            }

            // Find other videos in these categories
            const relatedVideos = await this.db
                .select()
                .from(tableSchemas.videoTable)
                .where(
                    and(
                        inArray(
                            tableSchemas.videoTable.id,
                            this.db
                                .select({
                                    videoId:
                                        tableSchemas.videosToCategoriesTable
                                            .videoId,
                                })
                                .from(tableSchemas.videosToCategoriesTable)
                                .where(
                                    inArray(
                                        tableSchemas.videosToCategoriesTable
                                            .categoryId,
                                        categories.map((c) => c.categoryId),
                                    ),
                                ),
                        ),
                        ne(tableSchemas.videoTable.id, videoId), // Exclude current video
                    ),
                )
                .orderBy(desc(tableSchemas.videoTable.viewCount))
                .limit(5);

            return relatedVideos;
        } catch (error) {}
    }
    async findWithUsername(username: string, offset: number, size: number) {
        try {
            const videos = await this.db.query.videoTable.findMany({
                where: inArray(
                    tableSchemas.videoTable.userId,
                    this.db
                        .select({ userId: tableSchemas.userTable.id })
                        .from(tableSchemas.userTable)
                        .where(eq(tableSchemas.userTable.username, username)),
                ),
                extras: this.getLikeAndDislikeCount(),
                offset: offset,
                limit: size,
                orderBy: [
                    desc(tableSchemas.videoTable.createdAt),
                    asc(tableSchemas.videoTable.title),
                ],
            });
            const totalRecords = await this.db.$count(
                tableSchemas.videoTable,
                inArray(
                    tableSchemas.videoTable.userId,
                    this.db
                        .select({ userId: tableSchemas.userTable.id })
                        .from(tableSchemas.userTable)
                        .where(eq(tableSchemas.userTable.username, username)),
                ),
            );
            return { videos, totalRecords };
        } catch (error) {
            console.error(error);
        }
    }
    async findVideoForHomeProfile(username: string) {
        const top4Categories = await this.db
            .select({
                categoryId: tableSchemas.categoryTable.id,
                name: tableSchemas.categoryTable.name,
                totalViews:
                    sql<number>`SUM(${tableSchemas.videoTable.viewCount})`.as(
                        "totalViews",
                    ),
            })
            .from(tableSchemas.videoTable)
            .innerJoin(
                tableSchemas.videosToCategoriesTable,
                eq(
                    tableSchemas.videosToCategoriesTable.videoId,
                    tableSchemas.videoTable.id,
                ),
            )
            .innerJoin(
                tableSchemas.categoryTable,
                eq(
                    tableSchemas.categoryTable.id,
                    tableSchemas.videosToCategoriesTable.categoryId,
                ),
            )
            .where(
                inArray(
                    tableSchemas.videoTable.userId,
                    this.db
                        .select({ userId: tableSchemas.userTable.id })
                        .from(tableSchemas.userTable)
                        .where(eq(tableSchemas.userTable.username, username)),
                ),
            )
            .groupBy(tableSchemas.categoryTable.id)
            .orderBy(sql`SUM(${tableSchemas.videoTable.viewCount}) DESC`)
            .limit(4);

        const result = [];

        for (let category of top4Categories) {
            const videos = await this.db
                .select()
                .from(tableSchemas.videoTable)
                .innerJoin(
                    tableSchemas.videosToCategoriesTable,
                    eq(
                        tableSchemas.videoTable.id,
                        tableSchemas.videosToCategoriesTable.videoId,
                    ),
                )
                .where(
                    and(
                        eq(
                            tableSchemas.videosToCategoriesTable.categoryId,
                            category.categoryId,
                        ),
                        inArray(
                            tableSchemas.videoTable.userId,
                            this.db
                                .select({ userId: tableSchemas.userTable.id })
                                .from(tableSchemas.userTable)
                                .where(
                                    eq(
                                        tableSchemas.userTable.username,
                                        username,
                                    ),
                                ),
                        ),
                    ),
                )
                .orderBy(desc(tableSchemas.videoTable.viewCount))
                .limit(5);

            result.push({
                category: category.name,
                video: videos.map((row) => row.videos),
            });
        }
        return result;
    }
    async getNumberOfVideoByUserId(userId: string) {
        const totalRecords = await this.db.$count(
            tableSchemas.videoTable,
            eq(tableSchemas.videoTable.userId, userId),
        );
        return totalRecords;
    }
}
