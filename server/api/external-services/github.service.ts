import { UserDTO } from "../dtos/user.dto";
import { Utils } from "../lib/helpers/utils";
import { GitHubValidation } from "../lib/validations/schema.validation";
import { IGitHubAccountRepository } from "../repositories/account.repository";
import { IUserService } from "../services/user.service";
import { GitHub, generateState } from "arctic";

import { envClient } from "@/lib/env/env.client";
import { envServer } from "@/lib/env/env.server";

import { ILuciaService, LuciaService } from "./lucia.service";

export interface IGitHubService extends Utils.AutoMappedClass<GitHubService> {}

export class GitHubService implements IGitHubService {
    private readonly gitHubClient: GitHub;
    private readonly luciaService: ILuciaService;

    constructor(
        private readonly accountRepository: IGitHubAccountRepository,
        private readonly userService: IUserService,
    ) {
        this.gitHubClient = new GitHub(
            envServer.GITHUB_CLIENT_ID,
            envServer.GITHUB_CLIENT_SECRET,
            {
                redirectURI: `${envClient.NEXT_PUBLIC_APP_URL}/api/auth/oauth/github/callback`,
            },
        );
        this.luciaService = new LuciaService();
    }

    public async getOauthConsentUrl() {
        const state = generateState();
        const url = await this.gitHubClient.createAuthorizationURL(state, {
            scopes: ["user:email"],
        });
        return { state, url };
    }

    public async verifyCode(code: string) {
        return this.gitHubClient.validateAuthorizationCode(code);
    }

    public async authenticateUser(gitHubData: GitHubValidation.Response) {
        const existingUser = await this.userService.getUserByEmailOrUsername(
            gitHubData.email,
        );
        let userId: string | undefined;

        if (existingUser) {
            userId = await this.updateExistingUser(
                existingUser.id,
                existingUser,
                gitHubData,
            );
        } else {
            userId = await this.createNewUser(gitHubData);
        }
        return userId
            ? this.initiateSession(userId)
            : { session: null, sessionCookie: null };
    }

    private async updateExistingUser(
        userId: string,
        existingUser: UserDTO.Update,
        gitHubData: GitHubValidation.Response,
    ) {
        if (
            existingUser.hashedPassword ||
            !existingUser.emailVerified ||
            !existingUser.imageUrl
        ) {
            console.log("Vao update");
            const user = await this.accountRepository.updateAccountTransaction(
                {
                    providerId: "github",
                    providerUserId: gitHubData.id,
                    userId: userId,
                },
                {
                    emailVerified: gitHubData.verified_email,
                    hashedPassword: null,
                    imageUrl: gitHubData.avatar_url,
                },
            );
            return user?.id;
        }
        return userId;
    }

    private async createNewUser(gitHubData: GitHubValidation.Response) {
        const newAccount =
            await this.accountRepository.createGitHubAccountTransaction(
                gitHubData,
            );
        return newAccount?.id;
    }

    public async terminateSession(sessionId: string) {
        await this.luciaService.revokeSession(sessionId);
        return this.luciaService.getSessionCookieName();
    }

    public async initiateSession(userId: string) {
        return this.luciaService.initiateSession(userId);
    }
}
