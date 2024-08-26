import {
    ISignupController,
    SignupController,
} from "../controllers/signup.controller";
import { CreateFactoryType } from "../lib/types/factory.type";
import { createFactory } from "hono/factory";

class AuthRoutes {
    private factory: CreateFactoryType;
    private signupController: ISignupController;
    constructor() {
        this.factory = createFactory();
        this.signupController = new SignupController(this.factory);
    }
    setupRoutes() {
        return this.factory
            .createApp()
            .route("/auth", this.signupController.setupHandlers());
    }
}

const authRoutesInstance = new AuthRoutes();
export const authRoutes = authRoutesInstance.setupRoutes();
