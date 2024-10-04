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
import { UserRepository } from "../repositories/user.repository";
import { AuthService } from "../services/auth.service";
import { EmailVerificationService } from "../services/email-verification.service";
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
    // Service
    const userService = new UserService(userRepository);
    const getstreamService = new GetStreamService();
    const authService = new AuthService(userService, getstreamService);
    const nodemailService = new NodemailService();
    const emailVerificationService = new EmailVerificationService(
        emailVerificationRepository,
    );
    const getStreamService = new GetStreamService();
    const githubService = new GitHubService(accountRepository, userService);
    // Controller
    const goolgeService = new GoogleService(
        accountRepository,
        userService,
        getstreamService,
    );
    const authController = new AuthController(
        factory,
        authService,
        userService,
        emailVerificationService,
        nodemailService,
    );
    const oauthController = new OauthController(
        factory,
        goolgeService,
        githubService,
    );
    return new AuthRoutes(factory, authController, oauthController);
}

export const authRoutes = createAuthRoutes().setupRoutes();
