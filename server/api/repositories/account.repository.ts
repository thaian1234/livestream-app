import { and, eq } from "drizzle-orm";

import Database from "@/server/db";
import tableSchemas from "@/server/db/schemas";

import { Utils } from "../lib/helpers/utils";

import { AccountDTO } from "../dtos/account.dto";
import { GithubDTO } from "../dtos/github.dto";
import { GoogleDTO } from "../dtos/google.dto";
import { UserDTO } from "../dtos/user.dto";

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
    public async create(data: AccountDTO.Insert) {
        try {
            const account = await this.db
                .insert(tableSchemas.accountTable)
                .values(data);
            return account;
        } catch (error) {}
    }
    public async findOne(fields: AccountDTO.FindOne) {
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
        googleData: GoogleDTO.Response,
    ) {
        try {
            return await this.db.transaction(async (tx) => {
                const [newUser] = await tx
                    .insert(tableSchemas.userTable)
                    .values({
                        email: googleData.email,
                        username: googleData.name,
                        imageUrl: googleData.picture,
                        emailVerified: googleData.verified_email,
                    })
                    .returning();
                await tx.insert(tableSchemas.accountTable).values({
                    providerId: "google",
                    providerUserId: googleData.id,
                    userId: newUser.id,
                });
                await tx.insert(tableSchemas.streamTable).values({
                    name: `${newUser.username}'s stream`,
                    userId: newUser.id,
                });
                return newUser;
            });
        } catch (error) {}
    }
    public async updateAccountTransaction(
        accountData: AccountDTO.Insert,
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
        githubData: GithubDTO.Response,
    ) {
        try {
            return await this.db.transaction(async (tx) => {
                const [newUser] = await tx
                    .insert(tableSchemas.userTable)
                    .values({
                        email: githubData.email,
                        username: githubData.name,
                        imageUrl: githubData.avatar_url,
                        emailVerified: githubData.verified_email,
                    })
                    .returning();
                await tx.insert(tableSchemas.accountTable).values({
                    providerId: "github",
                    providerUserId: githubData.id,
                    userId: newUser.id,
                });
                await tx.insert(tableSchemas.streamTable).values({
                    name: `${newUser.username}'s stream`,
                    userId: newUser.id,
                });
                return newUser;
            });
        } catch (error) {}
    }
}
