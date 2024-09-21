import { IGoogleService } from "../external-services/google.service";
import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { GoogleValidation } from "../lib/validations/schema.validation";
import { Validator } from "../lib/validations/validator";
import { zValidator } from "@hono/zod-validator";
import { getCookie, setCookie } from "hono/cookie";
import { z } from "zod";

import { envClient } from "@/lib/env/env.client";
import { envServer } from "@/lib/env/env.server";

export interface IOauthController
    extends Utils.AutoMappedClass<OauthController> {}

export class OauthController implements IOauthController {
    cookiesName;
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly googleSerivce: IGoogleService,
    ) {
        this.cookiesName = {
            GOOGLE_STATE: "google_oauth_state",
            GOOGLE_CODE_VERIFIER: "google_oauth_codeVerifier",
        } as const;
    }
    public setupHandlers() {
        return this.factory
            .createApp()
            .basePath("/oauth")
            .get("/google", ...this.loginGoogleHandler())
            .get("/google/callback", ...this.loginGoogleCallbackHandler());
    }
    private loginGoogleHandler() {
        return this.factory.createHandlers(async (c) => {
            const { state, url, codeVerifier } =
                await this.googleSerivce.getOauthConsentUrl();
            setCookie(c, this.cookiesName.GOOGLE_STATE, state, {
                httpOnly: true,
                maxAge: 60 * 10,
                secure: envClient.NODE_ENV === "production",
            });
            setCookie(c, this.cookiesName.GOOGLE_CODE_VERIFIER, codeVerifier, {
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
                    getCookie(c, this.cookiesName.GOOGLE_CODE_VERIFIER) ?? null;
                const cookieState =
                    getCookie(c, this.cookiesName.GOOGLE_STATE) ?? null;
                console.log("cookieState", cookieState);
                if (
                    !cookieCodeVerifier ||
                    !cookieState ||
                    cookieState !== state
                ) {
                    console.error("No code verifier or state");
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
                const googleData = GoogleValidation.responseSchema.parse(
                    await googleResponse.json(),
                );
                const { session, sessionCookie } =
                    await this.googleSerivce.authenticateUser(googleData);
                if (!session || !sessionCookie) {
                    throw new MyError.UnauthorizedError(
                        "Something went wrong with your Google Account",
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
