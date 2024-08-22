import { MyError } from "../lib/helpers/errors";
import { UserValidation } from "../lib/validations/schema.validation";
import { eq } from "drizzle-orm";

import Database from "@/server/db";
import tableSchemas from "@/server/db/schemas";

import { IReader, IWriter } from "./types.repository";

export interface IUserRepository
    extends IWriter<
            UserValidation.Insert,
            UserValidation.Update,
            UserValidation.Select
        >,
        IReader<UserValidation.Select> {}

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
            if (!user) {
                throw new MyError.NotFoundError();
            }
            return UserValidation.selectSchema.parse(user);
        } catch (error) {
            throw error;
        }
    }
    async findAll() {
        try {
            const users = await this.db.query.userTable.findMany();
            if (!users) {
                throw new MyError.NotFoundError();
            }
            return UserValidation.parseMany(users);
        } catch (error) {
            throw error;
        }
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
            return UserValidation.parse(user);
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
            return UserValidation.parse(user[0]);
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
        } catch (error) {
            throw error;
        }
    }
}
