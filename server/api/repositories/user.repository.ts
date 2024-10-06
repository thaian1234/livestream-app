import { UserDTO } from "../dtos/user.dto";
import { Utils } from "../lib/helpers/utils";
import { and, asc, desc, eq, gte, ilike, like, lte, or } from "drizzle-orm";

import Database from "@/server/db";
import tableSchemas from "@/server/db/schemas";

export interface IUserRepository
    extends Utils.AutoMappedClass<UserRepository> {}

export class UserRepository implements IUserRepository {
    private db;
    constructor() {
        this.db = Database.getInstance().db;
    }
    async findById(id: string) {
        try {
            const user = await this.db.query.userTable.findFirst({
                where: eq(tableSchemas.userTable.id, id),
            });
            return user;
        } catch (error) {}
    }
    async findByEmail(email: string) {
        try {
            const user = await this.db.query.userTable.findFirst({
                where: eq(tableSchemas.userTable.email, email),
            });
            return user;
        } catch (error) {}
    }
    async findAll() {
        try {
            const users = await this.db.query.userTable.findMany();
            return users;
        } catch (error) {}
    }
    async create(data: UserDTO.Insert) {
        try {
            return await this.db.transaction(async (tx) => {
                const [user] = await tx
                    .insert(tableSchemas.userTable)
                    .values(data)
                    .returning();
                await tx.insert(tableSchemas.streamTable).values({
                    name: `${user.username}'s stream`,
                    userId: user.id,
                });
                return user;
            });
        } catch (error) {}
    }
    async update(id: string, data: UserDTO.Update) {
        try {
            const user = await this.db
                .update(tableSchemas.userTable)
                .set(data)
                .where(eq(tableSchemas.userTable.id, id))
                .returning();

            return user[0];
        } catch (error) {}
    }
    async delete(id: string) {
        try {
            const rows = await this.db
                .delete(tableSchemas.userTable)
                .where(eq(tableSchemas.userTable.id, id));
            if (rows.length == 0) {
                return false;
            }
            return true;
        } catch (error) {}
    }
    async findByEmailOrUsername(email: string, username: string) {
        try {
            const user = await this.db.query.userTable.findFirst({
                where: or(
                    eq(tableSchemas.userTable.email, email),
                    eq(tableSchemas.userTable.username, username),
                ),
            });
            return user;
        } catch (error) {}
    }
    async advancedSearchUser(
        username: string = "",
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
                ilike(tableSchemas.userTable.username, `%${username}%`),
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
        const result = await this.db.query.userTable.findMany({
            where: and(...conditions),
            limit: limit,
            offset: offset,
            orderBy: orderBy,
        });
        return result;
    }
    async findUserWithAccount(userId: string) {
        try {
            const userWithAccount = await this.db.query.userTable.findFirst({
                where: eq(tableSchemas.userTable.id, userId),
                with: {
                    accounts: true,
                },
            });
            return userWithAccount;
        } catch (error) {}
    }
    async findByUsername(username: string) {
        try {
            const user = await this.db.query.userTable.findFirst({
                where: eq(tableSchemas.userTable.username, username),
            });
            return user;
        } catch (error) {}
    }
}
