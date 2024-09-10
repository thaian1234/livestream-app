import { LuciaService } from "../external-services/lucia.service";
import { INodemailService } from "../external-services/nodemail.service";
import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import {
    AuthValidation,
    EmailVerificationValidation,
} from "../lib/validations/schema.validation";
import { Validator } from "../lib/validations/validator";
import { IAuthService } from "../services/auth.service";
import { IEmailVerificationService } from "../services/email-verification.service";
import { IUserService } from "../services/user.service";
import { zValidator } from "@hono/zod-validator";
import { getCookie, setCookie } from "hono/cookie";

export interface IAuthController
    extends Utils.PickMethods<AuthController, "setupHandlers"> {}

export class AuthController implements IAuthController {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly authService: IAuthService,
        private readonly userService: IUserService,
        private readonly emailVerificationService: IEmailVerificationService,
        private readonly nodemailService: INodemailService,
    ) {}
    public setupHandlers() {
        return this.factory
            .createApp()
            .post("/sign-in", ...this.signInHandler())
            .post("/sign-out", ...this.signOutHandler())
            .post("/sign-up", ...this.signUpHandler())
            .post("/verify-email", ...this.verifyEmailHandler());
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
                const user = await this.authService.registerUser(jsonData);
                if (!user) {
                    throw new MyError.BadRequestError("Failed to sign up user");
                }
                // Generate code
                const code =
                    await this.emailVerificationService.generateEmailVerificationCode(
                        user.id,
                    );
                if (!code) {
                    throw new MyError.BadRequestError(
                        "Cannot generate your email verification code. Please try again!",
                    );
                }
                c.var.executionCtx.waitUntil(
                    this.nodemailService.sendVerifcationEmailCode(
                        code,
                        user.email,
                    ),
                );
                return ApiResponse.WriteJSON({
                    c,
                    msg: "User registered. Please check your email for verification code.",
                    status: HttpStatus.Created,
                    data: {
                        userId: user.id,
                    },
                });
            },
        );
    }
    private verifyEmailHandler() {
        return this.factory.createHandlers(
            zValidator("json", EmailVerificationValidation.verifyEmailSchema),
            async (c) => {
                const { code, userId } = c.req.valid("json");
                const isVerified =
                    await this.emailVerificationService.verifyCode(
                        userId,
                        code,
                    );
                if (!isVerified) {
                    throw new MyError.BadRequestError(
                        "Invalid or expired verification code",
                    );
                }
                await this.userService.updateUser(userId, {
                    emailVerified: true,
                });
                const { sessionCookie } =
                    await this.authService.initiateSession(userId);
                setCookie(c, sessionCookie.name, sessionCookie.value, {
                    ...sessionCookie.attributes,
                    sameSite: "Strict",
                });
                return ApiResponse.WriteJSON({
                    c,
                    msg: "Email verified and logged in successfully",
                    status: HttpStatus.OK,
                    data: undefined,
                });
            },
        );
    }
}
