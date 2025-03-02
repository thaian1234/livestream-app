import { and, count, desc, eq, inArray, ne, sql } from "drizzle-orm";

import Database from "@/server/db";
import tableSchemas from "@/server/db/schemas";

import { Utils } from "../lib/helpers/utils";

import { CommentDTO } from "../dtos/comment.dto";

export interface ICommentRepository
    extends Utils.AutoMappedClass<CommentRepository> {}

export class CommentRepository implements ICommentRepository {
    private db;
    constructor() {
        this.db = Database.getInstance().db;
    }
    async findById(id: string) {
        try {
            const comment = await this.db.query.commentTable.findFirst({
                where: eq(tableSchemas.commentTable.id, id),
                with: {
                    user: true,
                },
            });
            return comment;
        } catch (error) {
            console.error(error);
        }
    }
    async findByUserId(userId: string, offset: number, size: number) {
        try {
            const comments = await this.db.query.commentTable.findMany({
                where: eq(tableSchemas.commentTable.userId, userId),
                offset: offset,
                limit: size,
            });
            const totalRecords = await this.db.$count(
                tableSchemas.commentTable,
                eq(tableSchemas.commentTable.userId, userId),
            );
            return { comments, totalRecords };
        } catch (error) {
            console.error(error);
        }
    }
    async findByVideoId(videoId: string, offset: number, size: number) {
        try {
            const comments = await this.db.query.commentTable.findMany({
                where: eq(tableSchemas.commentTable.videoId, videoId),
                offset: offset,
                limit: size,
                with: {
                    user: true
                }
            });
            const totalRecords = await this.db.$count(
                tableSchemas.commentTable,
                eq(tableSchemas.commentTable.videoId, videoId),
            );
            return { comments, totalRecords };
        } catch (error) {
            console.error(error);
        }
    }
    async findAll() {
        try {
            const comments = await this.db.query.commentTable.findMany({});
            return comments;
        } catch (error) {
            console.error(error);
        }
    }
    async create(data: CommentDTO.Insert) {
        try {
            const comment = await this.db
                .insert(tableSchemas.commentTable)
                .values(data)
                .returning();
            return comment;
        } catch (error) {
            console.error(error);
        }
    }
    async update(id: string, data: CommentDTO.Update) {
        try {
            const comment = await this.db
                .update(tableSchemas.commentTable)
                .set(data)
                .where(eq(tableSchemas.commentTable.id, id))
                .returning();
            return comment[0];
        } catch (error) {
            console.error(error);
        }
    }
    async delete(id: string) {
        try {
            return await this.db
                .delete(tableSchemas.commentTable)
                .where(eq(tableSchemas.commentTable.id, id));
        } catch (error) {
            console.error(error);
        }
    }
}
