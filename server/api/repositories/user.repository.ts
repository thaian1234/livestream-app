import { Utils } from "../lib/helpers/utils";
import { UserValidation } from "../lib/validations/schema.validation";
import { eq, or } from "drizzle-orm";

import Database from "@/server/db";
import tableSchemas from "@/server/db/schemas";

import { IReader, IWriter } from "./types.repository";

export interface IUserRepository
    extends IWriter<
            UserValidation.Insert,
            UserValidation.Update,
            UserValidation.Select
        >,
        IReader<UserValidation.Select> {
    findByEmailOrUsername(
        email: string,
        username: string,
    ): Utils.MethodReturnType<UserRepository, "findByEmailOrUsername">;
    findByEmail(
        email: string,
    ): Utils.MethodReturnType<UserRepository, "findByEmail">;
}

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
            return UserValidation.parse(user);
        } catch (error) {}
    }
    async findByEmail(email: string) {
        try {
            const user = await this.db.query.userTable.findFirst({
                where: eq(tableSchemas.userTable.email, email),
            });
            return UserValidation.pareBase(user);
        } catch (error) {}
    }
    async findAll() {
        try {
            const users = await this.db.query.userTable.findMany();
            return UserValidation.parseMany(users);
        } catch (error) {}
    }
    async create(data: UserValidation.Insert) {
        try {
            const user = await this.db
                .insert(tableSchemas.userTable)
                .values(data)
                .returning();
            return UserValidation.parse(user[0]);
        } catch (error) {}
    }
    async update(id: string, data: UserValidation.Update) {
        try {
            const user = await this.db
                .update(tableSchemas.userTable)
                .set(data)
                .where(eq(tableSchemas.userTable.id, id))
                .returning();

            return UserValidation.parse(user[0]);
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
            return UserValidation.parse(user);
        } catch (error) {}
    }
}
