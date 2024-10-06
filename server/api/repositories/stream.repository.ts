import { StreamDTO } from "../dtos/stream.dto";
import { Utils } from "../lib/helpers/utils";
import { and, asc, desc, eq, gte, lte, sql } from "drizzle-orm";
import { Stream } from "stream";

import Database from "@/server/db";
import tableSchemas from "@/server/db/schemas";

export interface IStreamRepository
    extends Utils.AutoMappedClass<StreamRepository> {}

export class StreamRepository implements IStreamRepository {
    private db;
    constructor() {
        this.db = Database.getInstance().db;
    }
    async advancedSearchStream(
        name: string = "",
        dateFrom: Date = new Date("2000-01-01"),
        dateTo: Date = new Date(),
        isSortByCreatedAt: boolean = false,
        sortOrder: string = "asc",
        offset: number = 0,
        limit: number = 10,
    ) {
        const conditions = [];
        let orderBy;
        if (name) {
            conditions.push(
                sql`to_tsvector('simple', ${tableSchemas.streamTable.name}) @@ to_tsquery(${name})`,
            );
        }

        if (dateFrom) {
            conditions.push(gte(tableSchemas.streamTable.createdAt, dateFrom));
        }
        if (dateTo) {
            conditions.push(lte(tableSchemas.streamTable.createdAt, dateTo));
        }

        if (isSortByCreatedAt) {
            orderBy = sortOrder.toLowerCase().localeCompare("asc")
                ? asc(tableSchemas.streamTable.createdAt)
                : desc(tableSchemas.streamTable.createdAt);
        }
        const result = await this.db.query.streamTable.findMany({
            where: and(...conditions),
            limit: limit,
            offset: offset,
            orderBy: orderBy,
        });
        return result;
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
}
