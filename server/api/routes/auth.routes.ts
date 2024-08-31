import {
    AuthController,
    IAuthController,
} from "../controllers/auth.controller";
import { CreateFactoryType } from "../lib/types/factory.type";
import { UserRepository } from "../repositories/user.repository";
import { AuthService } from "../services/auth.service";
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
    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);
    const authService = new AuthService(userService);
    const authController = new AuthController(factory, authService);

    return new AuthRoutes(factory, authController);
}

export const authRoutes = createAuthRoutes().setupRoutes();
