import { LuciaService } from "../external-services/lucia.service";
import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { AuthValidation } from "../lib/validations/schema.validation";
import { Validator } from "../lib/validations/validator";
import { AuthService, IAuthService } from "../services/auth.service";
import { zValidator } from "@hono/zod-validator";
import { getCookie, setCookie } from "hono/cookie";

export interface IAuthController
    extends Utils.PickMethods<AuthController, "setupHandlers"> {}

export class AuthController implements IAuthController {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly authService: IAuthService,
    ) {}
    public setupHandlers() {
        return this.factory
            .createApp()
            .post("/sign-in", ...this.signInHandler())
            .post("/sign-out", ...this.signOutHandler())
            .post("/sign-up", ...this.signUpHandler());
    }
    private signInHandler() {
        return this.factory.createHandlers(
            zValidator(
                "json",
                AuthValidation.signinSchema,
                Validator.handleParseError,
            ),
            async (c) => {
                const jsonData = c.req.valid("json");
                const { session, sessionCookie } =
                    await this.authService.authenticateUser(jsonData);
                if (!session || !sessionCookie) {
                    throw new MyError.UnauthorizedError(
                        "Your Email or Password is not correct",
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
    private signOutHandler() {
        return this.factory.createHandlers(async (c) => {
            const sessionId = getCookie(
                c,
                LuciaService.getInstance().sessionCookieName,
            );
            if (!sessionId) {
                throw new MyError.UnauthenticatedError();
            }
            const sessionCookieName =
                await this.authService.terminateSession(sessionId);
            setCookie(c, sessionCookieName, "", {
                expires: new Date(0),
                sameSite: "Strict",
            });
            return ApiResponse.WriteJSON({
                c,
                msg: "Sign out successfully",
                status: HttpStatus.OK,
                data: undefined,
            });
        });
    }
    private signUpHandler() {
        return this.factory.createHandlers(
            zValidator(
                "json",
                AuthValidation.signupSchema,
                Validator.handleParseError,
            ),
            async (c) => {
                const jsonData = c.req.valid("json");
                const existingUser = await this.authService.verifyUserExistence(
                    jsonData.email,
                    jsonData.username,
                );
                if (existingUser) {
                    throw new MyError.BadRequestError(
                        "Email or Username already in use",
                    );
                }
                const { session, sessionCookie } =
                    await this.authService.registerUser(jsonData);
                if (!session || !sessionCookie) {
                    throw new MyError.UnauthorizedError("Sign up failed");
                }
                setCookie(c, sessionCookie.name, sessionCookie.value, {
                    ...sessionCookie.attributes,
                    sameSite: "Strict",
                });
                return ApiResponse.WriteJSON({
                    c,
                    status: HttpStatus.Created,
                    msg: "Sign up successfully",
                    data: undefined,
                });
            },
        );
    }
}
