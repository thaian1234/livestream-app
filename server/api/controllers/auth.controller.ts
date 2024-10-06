import { AuthDTO } from "../dtos/auth.dto";
import { EmailVerificationDTO } from "../dtos/email-verification.dto";
import { UserDTO } from "../dtos/user.dto";
import { INodemailService } from "../external-services/nodemail.service";
import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { Validator } from "../lib/validations/validator";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { IAuthService } from "../services/auth.service";
import { IEmailVerificationService } from "../services/email-verification.service";
import { IUserService } from "../services/user.service";
import { zValidator } from "@hono/zod-validator";
import { setCookie } from "hono/cookie";

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
            .post("/verify-email", ...this.verifyEmailHandler())
            .post("/resend-verify", ...this.resendVerifyCodeHandler())
            .get("/verify-session", ...this.verifySessionHandler());
    }
    private signInHandler() {
        return this.factory.createHandlers(
            zValidator(
                "json",
                AuthDTO.signinSchema,
                Validator.handleParseError,
            ),
            async (c) => {
                const jsonData = c.req.valid("json");
                const currentUser = c.get("user");
                const currentSession = c.get("session");
                const isSignedIn = currentUser && currentSession;
                if (isSignedIn && currentUser.email === jsonData.email) {
                    throw new MyError.ServiceUnavailableError(
                        "You are already signed in, please sign out for more actions",
                    );
                }
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
        return this.factory.createHandlers(
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const session = c.get("getSession");
                const sessionCookieName =
                    await this.authService.terminateSession(session.id);
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
            },
        );
    }
    private signUpHandler() {
        return this.factory.createHandlers(
            zValidator(
                "json",
                AuthDTO.signupSchema,
                Validator.handleParseError,
            ),
            async (c) => {
                const jsonData = c.req.valid("json");
                const existingUser =
                    await this.userService.getUserByEmailOrUsername(
                        jsonData.email,
                        jsonData.username,
                    );
                if (existingUser?.emailVerified) {
                    throw new MyError.BadRequestError("User already exists");
                }
                if (existingUser && !existingUser.emailVerified) {
                    throw new MyError.UnauthenticatedError(
                        "Your email is not verified",
                    );
                }
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
            zValidator(
                "json",
                EmailVerificationDTO.verifyEmailSchema,
                Validator.handleParseError,
            ),
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
    private resendVerifyCodeHandler() {
        return this.factory.createHandlers(
            zValidator(
                "json",
                AuthDTO.signupSchema,
                Validator.handleParseError,
            ),
            async (c) => {
                const jsonData = c.req.valid("json");
                const existingUser =
                    await this.userService.getUserByEmailOrUsername(
                        jsonData.email,
                        jsonData.username,
                    );
                if (!existingUser) {
                    throw new MyError.UnauthorizedError();
                }
                if (existingUser.emailVerified) {
                    throw new MyError.UnauthorizedError(
                        "This account is already registed",
                    );
                }
                const code =
                    await this.emailVerificationService.generateEmailVerificationCode(
                        existingUser.id,
                    );
                if (!code) {
                    throw new MyError.BadRequestError(
                        "Cannot generate your email verification code. Please try again!",
                    );
                }
                c.var.executionCtx.waitUntil(
                    this.nodemailService
                        .sendVerifcationEmailCode(code, existingUser.email)
                        .catch(() => {
                            throw new MyError.ServiceUnavailableError(
                                "Cannot send code to your email",
                            );
                        }),
                );
                return ApiResponse.WriteJSON({
                    c,
                    msg: "Please check your email for verification code.",
                    status: HttpStatus.Created,
                    data: undefined,
                });
            },
        );
    }
    private verifySessionHandler() {
        const respData = UserDTO.userWithAccountsAndStreamSchema;
        return this.factory.createHandlers(async (c) => {
            const user = c.get("user");
            const session = c.get("session");
            if (!user || !session) {
                throw new MyError.UnauthorizedError("Invalid session");
            }
            return ApiResponse.WriteJSON({
                c,
                status: HttpStatus.OK,
                msg: "Session verified successfully",
                data: {
                    user: respData.parse(user),
                },
            });
        });
    }
}
