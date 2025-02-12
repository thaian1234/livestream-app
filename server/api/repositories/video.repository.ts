import { VideoDTO } from "../dtos/video.dto";
import { Utils } from "../lib/helpers/utils";
import { eq } from "drizzle-orm";

import Database from "@/server/db";
import tableSchemas from "@/server/db/schemas";

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
            const rows = await this.db
                .delete(tableSchemas.videoTable)
                .where(eq(tableSchemas.videoTable.id, id));
            return rows.length !== 0;
        } catch (error) {
            console.error(error);
        }
    }
}
