import {
    AuthController,
    IAuthController,
} from "../controllers/auth.controller";
import { CreateFactoryType } from "../lib/types/factory.type";
import { createFactory } from "hono/factory";

class AuthRoutes {
    private factory: CreateFactoryType;
    private authController: IAuthController;
    constructor() {
        this.factory = createFactory();
        this.authController = new AuthController(this.factory);
    }
    setupRoutes() {
        return this.factory
            .createApp()
            .basePath("/auth")
            .route("/", this.authController.setupHandlers());
    }
}

const authRoutesInstance = new AuthRoutes();
export const authRoutes = authRoutesInstance.setupRoutes();
