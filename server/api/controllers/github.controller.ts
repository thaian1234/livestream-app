import { IGitHubService } from "../external-services/github.service";
import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { GitHubValidation } from "../lib/validations/schema.validation";
import { Validator } from "../lib/validations/validator";
import { zValidator } from "@hono/zod-validator";
import { getCookie, setCookie } from "hono/cookie";
import { z } from "zod";

import { envClient } from "@/lib/env/env.client";
import { envServer } from "@/lib/env/env.server";

export interface IGitHubController
    extends Utils.AutoMappedClass<GitHubController> {}

export class GitHubController implements IGitHubController {
    cookiesName;
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly gitHubSerivce: IGitHubService,
    ) {
        this.cookiesName = {
            GitHub_STATE: "GitHub_oauth_state",
        } as const;
    }
    public setupHandlers() {
        return this.factory
            .createApp()
            .basePath("/oauth")
            .get("/github", ...this.loginGitHubHandler())
            .get("/github/callback", ...this.loginGitHubCallbackHandler());
    }
    private loginGitHubHandler() {
        return this.factory.createHandlers(async (c) => {
            const { state, url } =
                await this.gitHubSerivce.getOauthConsentUrl();
            console.log("state", state);
            setCookie(c, this.cookiesName.GitHub_STATE, state, {
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
                    getCookie(c, this.cookiesName.GitHub_STATE) ?? null;
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

                const gitHubDataS = GitHubValidation.responseSchema.parse({
                    id: gitHubData.id,
                    email: gitHubEmail[0].email,
                    name: gitHubData.name || gitHubData.login,
                    avatar_url: gitHubData.avatar_url,
                    verified_email: true,
                });

                const { session, sessionCookie } =
                    await this.gitHubSerivce.authenticateUser(gitHubDataS);
                if (!session || !sessionCookie) {
                    throw new MyError.UnauthorizedError(
                        "Something went wrong with your GitHub Account",
                    );
                }
                setCookie(c, sessionCookie.name, sessionCookie.value, {
                    ...sessionCookie.attributes,
                    sameSite: "Strict",
                });
                return ApiResponse.WriteJSON({
                    c,
                    status: HttpStatus.OK,
                    msg: "Sign in successfully",
                    data: undefined,
                });
            },
        );
    }
}
