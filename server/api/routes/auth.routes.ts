import {
    AuthController,
    IAuthController,
} from "../controllers/auth.controller";
import {
    IOauthController,
    OauthController,
} from "../controllers/oauth.controller";
import { GetStreamService } from "../external-services/getstream.service";
import { GitHubService } from "../external-services/github.service";
import { GoogleService } from "../external-services/google.service";
import { NodemailService } from "../external-services/nodemail.service";
import { CreateFactoryType } from "../lib/types/factory.type";
import { AccountRepository } from "../repositories/account.repository";
import { EmailVerificationRepository } from "../repositories/email-verification.repository";
import { ForgetPasswordRepository } from "../repositories/forget-password.repository";
import { StreamRepository } from "../repositories/stream.repository";
import { UserRepository } from "../repositories/user.repository";
import { AuthService } from "../services/auth.service";
import { EmailVerificationService } from "../services/email-verification.service";
import { ForgetPasswordService } from "../services/forget-password.service";
import { StreamService } from "../services/stream.service";
import { UserService } from "../services/user.service";
import { createFactory } from "hono/factory";

class AuthRoutes {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly authController: IAuthController,
        private readonly oauthController: IOauthController,
    ) {}
    setupRoutes() {
        return this.factory
            .createApp()
            .basePath("/auth")
            .route("/", this.authController.setupHandlers())
            .route("/", this.oauthController.setupHandlers());
    }
}
function createAuthRoutes() {
    const factory = createFactory();
    // Repository
    const userRepository = new UserRepository();
    const emailVerificationRepository = new EmailVerificationRepository();
    const accountRepository = new AccountRepository();
    const streamRepository = new StreamRepository();
    const forgetPasswordRepository = new ForgetPasswordRepository();
    // Service
    const userService = new UserService(userRepository);
    const getStreamService = new GetStreamService();
    const authService = new AuthService(userService, getStreamService);
    const nodemailService = new NodemailService();
    const emailVerificationService = new EmailVerificationService(
        emailVerificationRepository,
    );
    const streamService = new StreamService(streamRepository);
    const githubService = new GitHubService(
        accountRepository,
        userService,
        getStreamService,
        streamService,
    );
    // Controller
    const goolgeService = new GoogleService(
        accountRepository,
        userService,
        getStreamService,
        streamService,
    );
    const forgetPasswordService = new ForgetPasswordService(
        forgetPasswordRepository,
    );
    const authController = new AuthController(
        factory,
        authService,
        userService,
        emailVerificationService,
        nodemailService,
        getStreamService,
        streamService,
        forgetPasswordService,
    );
    const oauthController = new OauthController(
        factory,
        goolgeService,
        githubService,
    );
    return new AuthRoutes(factory, authController, oauthController);
}

export const authRoutes = createAuthRoutes().setupRoutes();
