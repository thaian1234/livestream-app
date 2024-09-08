import {
    AuthController,
    IAuthController,
} from "../controllers/auth.controller";
import { CreateFactoryType } from "../lib/types/factory.type";
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
    ) {}
    setupRoutes() {
        return this.factory
            .createApp()
            .basePath("/auth")
            .route("/", this.authController.setupHandlers());
    }
}
function createAuthRoutes() {
    const factory = createFactory();
    // Repository
    const userRepository = new UserRepository();
    const emailVerificationRepository = new EmailVerificationRepository();
    // Service
    const userService = new UserService(userRepository);
    const authService = new AuthService(userService);
    const emailVerificationService = new EmailVerificationService(
        emailVerificationRepository,
    );
    // Controller
    const authController = new AuthController(
        factory,
        authService,
        userService,
        emailVerificationService,
    );
    return new AuthRoutes(factory, authController);
}

export const authRoutes = createAuthRoutes().setupRoutes();
