import { MyError } from "../lib/helpers/errors";
import { UserValidation } from "../lib/validations/schema.validation";
import { eq } from "drizzle-orm";

import Database from "@/server/db";
import tableSchemas from "@/server/db/schemas";

import { IWriter } from "./types.repository";

export interface IUserRepository
    extends IWriter<
        UserValidation.Insert,
        UserValidation.Update,
        UserValidation.Select
    > {}

export class UserRepository implements IUserRepository {
    private db;
    constructor() {
        this.db = Database.getInstance().db;
    }
    async create(data: UserValidation.Insert) {
        try {
            const user = await this.db
                .insert(tableSchemas.userTable)
                .values(data)
                .returning();
            if (user.length === 0) {
                throw new MyError.InternalServerError();
            }
            return user[0];
        } catch (error) {
            throw error;
        }
    }
    async update(id: string, data: UserValidation.Update) {
        try {
            const user = await this.db
                .update(tableSchemas.userTable)
                .set(data)
                .where(eq(tableSchemas.userTable.id, id))
                .returning();
            if (user.length === 0) {
                throw new MyError.NotFoundError();
            }
            return user[0];
        } catch (error) {
            throw error;
        }
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
}
