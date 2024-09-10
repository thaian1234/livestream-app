import { Utils } from "../lib/helpers/utils";
import { EmailVerificationValidation } from "../lib/validations/schema.validation";
import { eq } from "drizzle-orm";
import { TimeSpan, createDate } from "oslo";
import { isWithinExpirationDate } from "oslo";
import { alphabet, generateRandomString } from "oslo/crypto";

import Database from "@/server/db";
import tableSchemas from "@/server/db/schemas";

export interface IEmailVerificationRepository
    extends Utils.AutoMappedClass<EmailVerificationRepository> {}

export class EmailVerificationRepository
    implements IEmailVerificationRepository
{
    db;
    constructor() {
        this.db = Database.getInstance().db;
    }
    public async generateEmailVerificationCode(userId: string) {
        try {
            await this.deleleAllVerificationCodes(userId);
            const code = generateRandomString(8, alphabet("0-9"));
            await this.create({
                userId,
                code,
                expiresAt: createDate(new TimeSpan(15, "m")),
            });
			return code;
        } catch (error) {}
    }
    public async create(data: EmailVerificationValidation.Insert) {
        try {
            return await this.db
                .insert(tableSchemas.emailVerificationTable)
                .values(data)
                .returning();
        } catch (error) {}
    }
    public async verifyCode(userId: string, code: string) {
        try {
            return await this.db.transaction(async (tx) => {
                const databaseCode =
                    await tx.query.emailVerificationTable.findFirst({
                        where: eq(
                            tableSchemas.emailVerificationTable.userId,
                            userId,
                        ),
                    });
                if (!databaseCode || databaseCode.code !== code) {
                    tx.rollback();
                    return false;
                }
                await tx
                    .delete(tableSchemas.emailVerificationTable)
                    .where(eq(tableSchemas.emailVerificationTable.code, code));
                if (!isWithinExpirationDate(databaseCode.expiresAt)) {
                    tx.rollback();
                    return false;
                }
                return true;
            });
        } catch (error) {}
    }
    private async deleleAllVerificationCodes(userId: string) {
        try {
            const rows = await this.db
                .delete(tableSchemas.emailVerificationTable)
                .where(eq(tableSchemas.userTable.id, userId))
                .returning({
                    id: tableSchemas.emailVerificationTable.id,
                });
            return !!rows.length;
        } catch (error) {}
    }
}
