import {
    IUserController,
    UserController,
} from "../controllers/user.controller";
import { CreateFactoryType } from "../lib/types/factory.type";
import { createFactory } from "hono/factory";

class UserRoutes {
    private factory: CreateFactoryType;
    private userController: IUserController;
    constructor() {
        this.factory = createFactory();
        this.userController = new UserController(this.factory);
    }
    setupRoutes() {
        return this.factory
            .createApp()
            .route("/users", this.userController.setupHandlers());
    }
}

const userRoutesInstance = new UserRoutes();
export const userRoutes = userRoutesInstance.setupRoutes();
