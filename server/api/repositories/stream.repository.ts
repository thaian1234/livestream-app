import { Utils } from "../lib/helpers/utils";
import { and, asc, desc, gte, lte, sql } from "drizzle-orm";

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
        console.log("1");
        if (name) {
            conditions.push(
                sql`to_tsvector('simple', ${tableSchemas.streamTable.name}) @@ to_tsquery(${name})`,
            );
        }
        console.log("2");

        if (dateFrom) {
            conditions.push(gte(tableSchemas.streamTable.createdAt, dateFrom));
        }
        if (dateTo) {
            conditions.push(lte(tableSchemas.streamTable.createdAt, dateTo));
        }
        console.log("3");

        if (isSortByCreatedAt) {
            orderBy = sortOrder.toLowerCase().localeCompare("asc")
                ? asc(tableSchemas.streamTable.createdAt)
                : desc(tableSchemas.streamTable.createdAt);
        }
        console.log(orderBy);
        const result = await this.db.query.streamTable.findMany({
            where: and(...conditions),
            limit: limit,
            offset: offset,
            orderBy: orderBy,
        });
        return result;
    }
}
