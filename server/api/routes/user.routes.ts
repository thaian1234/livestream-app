import {
    IUserController,
    UserController,
} from "../controllers/user.controller";
import { CreateFactoryType } from "../lib/types/factory.type";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";
import { createFactory } from "hono/factory";

class UserRoutes {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly userController: IUserController,
    ) {}
    setupRoutes() {
        return this.factory
            .createApp()
            .route("/users", this.userController.setupHandlers());
    }
}

function createUserRoutes(): UserRoutes {
    const factory = createFactory();
    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);
    const userController = new UserController(factory, userService);

    return new UserRoutes(factory, userController);
}

export const userRoutes = createUserRoutes().setupRoutes();
