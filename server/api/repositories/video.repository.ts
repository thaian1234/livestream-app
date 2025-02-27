import { and, asc, desc, eq } from "drizzle-orm";

import Database from "@/server/db";
import tableSchemas from "@/server/db/schemas";

import { Utils } from "../lib/helpers/utils";

import { VideoDTO } from "../dtos/video.dto";

export interface IVideoRepository
    extends Utils.AutoMappedClass<VideoRepository> {}

export class VideoRepository implements IVideoRepository {
    private db;
    constructor() {
        this.db = Database.getInstance().db;
    }
    async findById(id: string) {
        try {
            const video = await this.db.query.videoTable.findFirst({
                where: eq(tableSchemas.videoTable.id, id),
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
            const videos = await this.db.query.videoTable.findMany();
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
}
