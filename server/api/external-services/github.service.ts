import { GithubDTO } from "../dtos/github.dto";
import { UserDTO } from "../dtos/user.dto";
import { Utils } from "../lib/helpers/utils";
import { IGitHubAccountRepository } from "../repositories/account.repository";
import { IStreamService } from "../services/stream.service";
import { IUserService } from "../services/user.service";
import { GitHub, generateState } from "arctic";

import { envClient } from "@/lib/env/env.client";
import { envServer } from "@/lib/env/env.server";

import { IGetStreamService } from "./getstream.service";
import { ILuciaService, LuciaService } from "./lucia.service";

export interface IGitHubService extends Utils.AutoMappedClass<GitHubService> {}

export class GitHubService implements IGitHubService {
    private readonly gitHubClient: GitHub;
    private readonly luciaService: ILuciaService;

    constructor(
        private readonly accountRepository: IGitHubAccountRepository,
        private readonly userService: IUserService,
        private readonly getStreamService: IGetStreamService,
        private readonly streamService: IStreamService,
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

    public async authenticateUser(gitHubData: GithubDTO.Response) {
        const existingUser = await this.userService.getUserByEmailOrUsername(
            gitHubData.email,
        );
        let userId: string | undefined;
        let isNew = false;
        if (existingUser) {
            userId = await this.updateExistingUser(
                existingUser.id,
                existingUser,
                gitHubData,
            );
        } else {
            userId = await this.createNewUser(gitHubData);
            isNew = true;
        }
        return userId
            ? { ...(await this.initiateSession(userId)), isNew }
            : { session: null, sessionCookie: null, isNew };
    }

    private async updateExistingUser(
        userId: string,
        existingUser: UserDTO.Update,
        gitHubData: GithubDTO.Response,
    ) {
        if (
            existingUser.hashedPassword ||
            !existingUser.emailVerified ||
            !existingUser.imageUrl
        ) {
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

    private async createNewUser(gitHubData: GithubDTO.Response) {
        const newAccount =
            await this.accountRepository.createGitHubAccountTransaction(
                gitHubData,
            );
        if (newAccount) {
            const stream = await this.streamService.getStreamByUserId(
                newAccount.id,
            );
            if (stream)
                await this.getStreamService.createChatChannel(
                    newAccount.id,
                    stream.id,
                );
        }
        await this.getStreamService.upsertUser(UserDTO.parse(newAccount));
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
