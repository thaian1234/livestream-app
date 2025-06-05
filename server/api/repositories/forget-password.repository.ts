import { eq } from "drizzle-orm";
import { TimeSpan, createDate } from "oslo";

import Database from "@/server/db";
import tableSchemas from "@/server/db/schemas";

import { Utils } from "../lib/helpers/utils";

export interface IForgetPasswordRepository
    extends Utils.AutoMappedClass<ForgetPasswordRepository> {}

export class ForgetPasswordRepository implements IForgetPasswordRepository {
    private db;
    constructor() {
        this.db = Database.getInstance().db;
    }
    async save(userId: string) {
        try {
            const [saved] = await this.db
                .insert(tableSchemas.forgetPasswordTable)
                .values({
                    userId: userId,
                    expiresAt: createDate(new TimeSpan(1, "d")),
                })
                .returning();
            return saved;
        } catch (error) {}
    }
    async findByUserId(userId: string) {
        try {
            const data = await this.db.query.forgetPasswordTable.findFirst({
                where: eq(tableSchemas.forgetPasswordTable.userId, userId),
            });
            return data;
        } catch (error) {}
    }
    async findById(id: string) {
        try {
            const data = await this.db.query.forgetPasswordTable.findFirst({
                where: eq(tableSchemas.forgetPasswordTable.id, id),
            });
            return data;
        } catch (error) {}
    }
    async delete(id: string) {
        try {
            const row = await this.db
                .delete(tableSchemas.forgetPasswordTable)
                .where(eq(tableSchemas.forgetPasswordTable.id, id))
                .returning();
            return row.length > 0;
        } catch (error) {}
    }
}
