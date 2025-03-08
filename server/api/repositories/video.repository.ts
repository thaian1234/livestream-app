import { and, count, desc, asc, eq, inArray, ne, sql } from "drizzle-orm";

import Database from "@/server/db";
import tableSchemas from "@/server/db/schemas";

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
}
