import { zValidator } from "@hono/zod-validator";
import { getCookie, setCookie } from "hono/cookie";
import { generateIdFromEntropySize } from "lucia";
import { z } from "zod";

import { ROUTES } from "@/lib/configs/routes.config";
import { envClient } from "@/lib/env/env.client";
import { envServer } from "@/lib/env/env.server";

import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { Validator } from "../lib/validations/validator";

import { IGitHubService } from "../external-services/github.service";
import { IGoogleService } from "../external-services/google.service";

import { GithubDTO } from "../dtos/github.dto";
import { GoogleDTO } from "../dtos/google.dto";

export interface IOauthController
    extends Utils.AutoMappedClass<OauthController> {}

export class OauthController implements IOauthController {
    private cookiesName;
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly googleSerivce: IGoogleService,
        private readonly gitHubSerivce: IGitHubService,
    ) {
        this.cookiesName = {
            OAUTH_STATE: "oauth_state",
            OAUTH_CODE_VERIFIER: "oauth_codeVerifier",
        } as const;
    }
    public setupHandlers() {
        return this.factory
            .createApp()
            .basePath("/oauth")
            .get("/google", ...this.loginGoogleHandler())
            .get("/google/callback", ...this.loginGoogleCallbackHandler())
            .get("/github", ...this.loginGitHubHandler())
            .get("/github/callback", ...this.loginGitHubCallbackHandler());
    }
    private loginGoogleHandler() {
        return this.factory.createHandlers(async (c) => {
            const { state, url, codeVerifier } =
                await this.googleSerivce.getOauthConsentUrl();
            setCookie(c, this.cookiesName.OAUTH_STATE, state, {
                httpOnly: true,
                maxAge: 60 * 10,
                secure: envClient.NODE_ENV === "production",
            });
            setCookie(c, this.cookiesName.OAUTH_CODE_VERIFIER, codeVerifier, {
                httpOnly: true,
                maxAge: 60 * 10,
                secure: envClient.NODE_ENV === "production",
            });
            return ApiResponse.WriteJSON({
                c,
                status: HttpStatus.Created,
                data: {
                    redirectTo: url.toString(),
                },
                msg: "Redirect",
            });
        });
    }
    private loginGoogleCallbackHandler() {
        const queries = z.object({
            state: z.string().min(1),
            code: z.string().min(1),
        });
        return this.factory.createHandlers(
            zValidator("query", queries, Validator.handleParseError),
            async (c) => {
                const { code, state } = c.req.valid("query");
                const cookieCodeVerifier =
                    getCookie(c, this.cookiesName.OAUTH_CODE_VERIFIER) ?? null;
                const cookieState =
                    getCookie(c, this.cookiesName.OAUTH_STATE) ?? null;
                if (
                    !cookieCodeVerifier ||
                    !cookieState ||
                    cookieState !== state
                ) {
                    throw new MyError.BadRequestError();
                }
                const { accessToken } = await this.googleSerivce.verifyCode(
                    code,
                    cookieCodeVerifier,
                );
                const googleResponse = await fetch(envServer.GOOGLE_API_URL, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                if (!googleResponse.ok) {
                    throw new MyError.BadRequestError(
                        "Failed to fetch Goolge Information",
                    );
                }
                const googleData = GoogleDTO.responseSchema.parse(
                    await googleResponse.json(),
                );
                googleData.name = `user_${generateIdFromEntropySize(3)}`;
                const { session, sessionCookie, isNew } =
                    await this.googleSerivce.authenticateUser(googleData);
                if (!session || !sessionCookie) {
                    throw new MyError.UnauthorizedError(
                        "Something went wrong with your Google Account",
                    );
                }
                setCookie(c, sessionCookie.name, sessionCookie.value, {
                    ...sessionCookie.attributes,
                });
                if (isNew) {
                    return c.redirect(
                        ROUTES.SET_USERNAME_PAGE,
                        HttpStatus.MovedPermanently,
                    );
                }
                return c.redirect(
                    ROUTES.HOME_PAGE,
                    HttpStatus.MovedPermanently,
                );
            },
        );
    }
    private loginGitHubHandler() {
        return this.factory.createHandlers(async (c) => {
            const { state, url } =
                await this.gitHubSerivce.getOauthConsentUrl();
            console.log("state", state);
            setCookie(c, this.cookiesName.OAUTH_STATE, state, {
                httpOnly: true,
                maxAge: 60 * 10,
                secure: envClient.NODE_ENV === "production",
            });
            return ApiResponse.WriteJSON({
                c,
                status: 200,
                data: {
                    redirectTo: url.toString(),
                },
                msg: "Redirect",
            });
        });
    }
    private loginGitHubCallbackHandler() {
        const queries = z.object({
            state: z.string().min(1),
            code: z.string().min(1),
        });
        return this.factory.createHandlers(
            zValidator("query", queries, Validator.handleParseError),
            async (c) => {
                const { code, state } = c.req.valid("query");
                const cookieState =
                    getCookie(c, this.cookiesName.OAUTH_STATE) ?? null;
                if (!cookieState || cookieState !== state) {
                    console.error("No state");
                    throw new MyError.BadRequestError();
                }
                const { accessToken } =
                    await this.gitHubSerivce.verifyCode(code);
                const gitHubResponse = await fetch(envServer.GITHUB_API_URL, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const gitHubEmailResponse = await fetch(
                    `${envServer.GITHUB_API_URL}/emails`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    },
                );
                if (!gitHubResponse.ok || !gitHubEmailResponse) {
                    throw new MyError.BadRequestError(
                        "Failed to fetch GitHub Information",
                    );
                }
                const gitHubData = await gitHubResponse.json();
                const gitHubEmail = await gitHubEmailResponse.json();

                if (!gitHubEmail[0].email) {
                    throw new MyError.BadRequestError(
                        "Github's email is not public, please public it and revoke our authorize to continue",
                    );
                }

                const gitHubDataS = GithubDTO.responseSchema.parse({
                    id: gitHubData.id,
                    email: gitHubEmail[0].email,
                    name: `user_${generateIdFromEntropySize(3)}`,
                    avatar_url: gitHubData.avatar_url,
                    verified_email: true,
                });
                const { session, sessionCookie, isNew } =
                    await this.gitHubSerivce.authenticateUser(gitHubDataS);
                if (!session || !sessionCookie) {
                    throw new MyError.UnauthorizedError(
                        "Something went wrong with your GitHub Account",
                    );
                }
                setCookie(c, sessionCookie.name, sessionCookie.value, {
                    ...sessionCookie.attributes,
                });
                if (isNew) {
                    return c.redirect(
                        ROUTES.SET_USERNAME_PAGE,
                        HttpStatus.MovedPermanently,
                    );
                }
                return c.redirect(
                    ROUTES.HOME_PAGE,
                    HttpStatus.MovedPermanently,
                );
            },
        );
    }
}
