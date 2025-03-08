import { and, count, desc, eq, inArray, ne, sql } from "drizzle-orm";

import { videoApi } from "@/lib/features/video/apis";

import Database from "@/server/db";
import tableSchemas from "@/server/db/schemas";

import { Utils } from "../lib/helpers/utils";

import { VideoLikeDTO } from "../dtos/video-like.dto";

export interface IVideoLikeRepository
    extends Utils.AutoMappedClass<VideoLikeRepository> {}

export class VideoLikeRepository implements IVideoLikeRepository {
    private db;
    constructor() {
        this.db = Database.getInstance().db;
    }
    async toggleLike(userId: string, videoId: string, isLike: boolean) {
        try {
            const type = isLike ? 1 : -1;
            const map = {
                "1": "liked",
                "-1": "disliked",
            };
            const existing = await this.db.query.videoLikeTable.findFirst({
                where: and(
                    eq(tableSchemas.videoLikeTable.videoId, videoId),
                    eq(tableSchemas.videoLikeTable.userId, userId),
                ),
            });

            if (existing) {
                if (existing.type === type) {
                    await this.delete({ userId, videoId });
                    return `You remove ${map[type]} successfully`;
                } else {
                    await this.update(userId, videoId, type);
                    return `You ${map[type]} successfully`;
                }
            } else {
                await this.create({ userId, videoId, type });
                return `You ${map[type]} successfully`;
            }
        } catch (error) {}
    }
    async create(data: VideoLikeDTO.Insert) {
        return await this.db.insert(tableSchemas.videoLikeTable).values(data);
    }
    async update(userId: string, videoId: string, type: number) {
        return await this.db
            .update(tableSchemas.videoLikeTable)
            .set({ type: type })
            .where(
                and(
                    eq(tableSchemas.videoLikeTable.userId, userId),
                    eq(tableSchemas.videoLikeTable.videoId, videoId),
                ),
            );
    }
    async delete(data: VideoLikeDTO.Delete) {
        return await this.db
            .delete(tableSchemas.videoLikeTable)
            .where(
                and(
                    eq(tableSchemas.videoLikeTable.userId, data.userId),
                    eq(tableSchemas.videoLikeTable.videoId, data.videoId),
                ),
            );
    }
}
