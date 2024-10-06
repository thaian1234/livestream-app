import { GoogleDTO } from "../dtos/google.dto";
import { UserDTO } from "../dtos/user.dto";
import { Utils } from "../lib/helpers/utils";
import { IGoogleAccountRepository } from "../repositories/account.repository";
import { IUserService } from "../services/user.service";
import { Google, generateCodeVerifier, generateState } from "arctic";

import { envClient } from "@/lib/env/env.client";
import { envServer } from "@/lib/env/env.server";

import { ILuciaService, LuciaService } from "./lucia.service";

export interface IGoogleService extends Utils.AutoMappedClass<GoogleService> {}

export class GoogleService implements IGoogleService {
    private readonly googleClient: Google;
    private readonly luciaService: ILuciaService;

    constructor(
        private readonly accountRepository: IGoogleAccountRepository,
        private readonly userService: IUserService,
    ) {
        this.googleClient = new Google(
            envServer.GOOGLE_CLIENT_ID,
            envServer.GOOGLE_CLIENT_SECRET,
            `${envClient.NEXT_PUBLIC_APP_URL}/api/auth/oauth/google/callback`,
        );
        this.luciaService = new LuciaService();
    }

    public async getOauthConsentUrl() {
        const state = generateState();
        const codeVerifier = generateCodeVerifier();
        const url = await this.googleClient.createAuthorizationURL(
            state,
            codeVerifier,
            {
                scopes: ["email", "profile"],
            },
        );
        return { state, url, codeVerifier };
    }

    public async verifyCode(code: string, codeVerifier: string) {
        return this.googleClient.validateAuthorizationCode(code, codeVerifier);
    }

    public async authenticateUser(googleData: GoogleDTO.Response) {
        const existingUser = await this.userService.getUserByEmailOrUsername(
            googleData.email,
        );
        let userId: string | undefined;
        let isNew = false;

        if (existingUser) {
            userId = await this.updateExistingUser(
                existingUser.id,
                existingUser,
                googleData,
            );
        } else {
            userId = await this.createNewUser(googleData);
            isNew = true;
        }
        return userId
            ? { ...(await this.initiateSession(userId)), isNew }
            : { session: null, sessionCookie: null, isNew };
    }

    private async updateExistingUser(
        userId: string,
        existingUser: UserDTO.Update,
        googleData: GoogleDTO.Response,
    ) {
        if (
            existingUser.hashedPassword ||
            !existingUser.emailVerified ||
            !existingUser.imageUrl
        ) {
            const user = await this.accountRepository.updateAccountTransaction(
                {
                    providerId: "google",
                    providerUserId: googleData.id,
                    userId: userId,
                },
                {
                    emailVerified: googleData.verified_email,
                    hashedPassword: null,
                    imageUrl: googleData.picture,
                },
            );
            return user?.id;
        }
        return userId;
    }

    private async createNewUser(googleData: GoogleDTO.Response) {
        const newAccount =
            await this.accountRepository.createGoogleAccountTransaction(
                googleData,
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
