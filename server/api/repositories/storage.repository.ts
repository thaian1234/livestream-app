import { and, count, desc, eq, inArray, sql } from "drizzle-orm";

import Database from "@/server/db";
import tableSchemas from "@/server/db/schemas";

import { Utils } from "../lib/helpers/utils";

import { QueryDTO } from "../dtos/query.dto";
import { StorageDTO } from "../dtos/storage.dto";

export interface IStorageRepository
    extends Utils.AutoMappedClass<StorageRepository> {}

export class StorageRepository implements IStorageRepository {
    private db;
    constructor() {
        this.db = Database.getInstance().db;
    }
    async findById(id: string) {
        try {
            const storage = await this.db.query.storageTable.findFirst({
                where: eq(tableSchemas.storageTable.id, id),
            });
            return storage;
        } catch (error) {
            console.error(error);
        }
    }
    async findAll() {
        try {
            const storages = await this.db.query.storageTable.findMany();
            return storages;
        } catch (error) {
            console.error(error);
        }
    }
    async findByStreamId(streamId: string, pagination: QueryDTO.Pagination) {
        try {
            const totalRecords = await this.db.$count(
                tableSchemas.storageTable,
                eq(tableSchemas.storageTable.streamId, streamId),
            );
            const assets = await this.db.query.storageTable.findMany({
                where: eq(tableSchemas.storageTable.streamId, streamId),
                limit: pagination.size,
                offset: pagination.size * (pagination.page - 1),
                orderBy: [desc(tableSchemas.storageTable.createdAt)],
            });

            return { assets, totalRecords };
        } catch (error) {
            console.error(error);
        }
    }
    async create(data: StorageDTO.Insert) {
        try {
            const [storage] = await this.db
                .insert(tableSchemas.storageTable)
                .values(data)
                .returning();
            return storage;
        } catch (error) {
            console.error(error);
        }
    }
    async update(id: string, data: StorageDTO.Update) {
        try {
            const storage = await this.db
                .update(tableSchemas.storageTable)
                .set(data)
                .where(eq(tableSchemas.storageTable.id, id))
                .returning();
            return storage[0];
        } catch (error) {
            console.error(error);
        }
    }
    async delete(id: string) {
        try {
            return await this.db
                .delete(tableSchemas.storageTable)
                .where(eq(tableSchemas.storageTable.id, id));
        } catch (error) {
            console.error(error);
        }
    }
    async getStorageStats(streamId: string) {
        try {
            const result = await this.db
                .select({
                    totalVideos: count(tableSchemas.storageTable.id),
                    totalDuration: sql<number>`COALESCE(SUM(EXTRACT(EPOCH FROM (${tableSchemas.storageTable.endTime} - ${tableSchemas.storageTable.startTime}))), 0)`,
                    averageDuration: sql<number>`COALESCE(AVG(EXTRACT(EPOCH FROM (${tableSchemas.storageTable.endTime} - ${tableSchemas.storageTable.startTime}))), 0)`,
                    readyVideosCount: sql<number>`COUNT(CASE WHEN ${tableSchemas.storageTable.status} = 'ready' THEN 1 END)`,
                })
                .from(tableSchemas.storageTable)
                .where(eq(tableSchemas.storageTable.streamId, streamId));

            return result[0];
        } catch (error) {
            console.error("Error getting storage stats:", error);
        }
    }
}
