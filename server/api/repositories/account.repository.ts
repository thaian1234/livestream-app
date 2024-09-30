import { UserDTO } from "../dtos/user.dto";
import { Utils } from "../lib/helpers/utils";
import {
    AccountValidation,
    GitHubValidation,
    GoogleValidation,
} from "../lib/validations/schema.validation";
import { and, eq } from "drizzle-orm";

import Database from "@/server/db";
import tableSchemas from "@/server/db/schemas";

export interface IAccountRepository
    extends Utils.AutoMappedClass<AccountRepository> {}
export interface IGoogleAccountRepository
    extends Utils.PickMethods<
        AccountRepository,
        "updateAccountTransaction" | "createGoogleAccountTransaction"
    > {}
export interface IGitHubAccountRepository
    extends Utils.PickMethods<
        AccountRepository,
        "createGitHubAccountTransaction" | "updateAccountTransaction"
    > {}
export class AccountRepository implements IAccountRepository {
    db;
    constructor() {
        this.db = Database.getInstance().db;
    }
    public async create(data: AccountValidation.Insert) {
        try {
            const account = await this.db
                .insert(tableSchemas.accountTable)
                .values(data);
            return account;
        } catch (error) {}
    }
    public async findOne(fields: AccountValidation.FindOne) {
        try {
            const account = await this.db.query.accountTable.findFirst({
                where: and(
                    eq(tableSchemas.accountTable.providerId, fields.providerId),
                    eq(
                        tableSchemas.accountTable.providerUserId,
                        fields.providerUserId,
                    ),
                ),
            });
            return account;
        } catch (error) {}
    }
    public async createGoogleAccountTransaction(
        googleData: GoogleValidation.Response,
    ) {
        try {
            return await this.db.transaction(async (tx) => {
                const [newUser] = await tx
                    .insert(tableSchemas.userTable)
                    .values({
                        email: googleData.email,
                        username: googleData.email,
                        imageUrl: googleData.picture,
                        emailVerified: googleData.verified_email,
                    })
                    .returning();
                await tx.insert(tableSchemas.accountTable).values({
                    providerId: "google",
                    providerUserId: googleData.id,
                    userId: newUser.id,
                });
                return newUser;
            });
        } catch (error) {}
    }
    public async updateAccountTransaction(
        accountData: AccountValidation.Insert,
        userData: UserDTO.Update,
    ) {
        try {
            return await this.db.transaction(async (tx) => {
                const [user] = await tx
                    .update(tableSchemas.userTable)
                    .set(userData)
                    .where(eq(tableSchemas.userTable.id, accountData.userId))
                    .returning();
                await tx
                    .insert(tableSchemas.accountTable)
                    .values(accountData)
                    .onConflictDoUpdate({
                        set: accountData,
                        target: [
                            tableSchemas.accountTable.providerUserId,
                            tableSchemas.accountTable.providerId,
                        ],
                        targetWhere: and(
                            eq(
                                tableSchemas.accountTable.providerId,
                                accountData.providerId,
                            ),
                            eq(
                                tableSchemas.accountTable.providerUserId,
                                accountData.providerUserId,
                            ),
                        ),
                    });
                return user;
            });
        } catch (error) {}
    }
    public async createGitHubAccountTransaction(
        githubData: GitHubValidation.Response,
    ) {
        try {
            return await this.db.transaction(async (tx) => {
                const [newUser] = await tx
                    .insert(tableSchemas.userTable)
                    .values({
                        email: githubData.email,
                        username: githubData.email,
                        imageUrl: githubData.avatar_url,
                        emailVerified: githubData.verified_email,
                    })
                    .returning();
                await tx.insert(tableSchemas.accountTable).values({
                    providerId: "github",
                    providerUserId: githubData.id,
                    userId: newUser.id,
                });
                return newUser;
            });
        } catch (error) {}
    }
}
