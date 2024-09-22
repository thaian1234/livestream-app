import { Utils } from "../lib/helpers/utils";

import Database from "@/server/db";

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
        if (username) {
            conditions.push(
                like(tableSchemas.userTable.username, `%${username}%`),
            );
        }
        if (dateFrom) {
            conditions.push(gte(tableSchemas.userTable.createdAt, dateFrom));
        }
        if (dateTo) {
            conditions.push(lte(tableSchemas.userTable.createdAt, dateTo));
        }
        if (isSortByCreatedAt) {
            orderBy = sortOrder.toLowerCase().localeCompare("asc")
                ? asc(tableSchemas.userTable.createdAt)
                : desc(tableSchemas.userTable.createdAt);
        }
        console.log(orderBy);
        const result = await this.db.query.userTable.findMany({
            where: and(...conditions),
            limit: limit,
            offset: offset,
            orderBy: orderBy,
        });
        return result;
    }
}
