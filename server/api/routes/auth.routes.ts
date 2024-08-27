import {
    ISigninController,
    SigninController,
} from "../controllers/signin.controller";
import {
    ISignupController,
    SignupController,
} from "../controllers/signup.controller";
import { CreateFactoryType } from "../lib/types/factory.type";
import { createFactory } from "hono/factory";

class AuthRoutes {
    private factory: CreateFactoryType;
    private signupController: ISignupController;
    private signinController: ISigninController;
    constructor() {
        this.factory = createFactory();
        this.signupController = new SignupController(this.factory);
        this.signinController = new SigninController(this.factory);
    }
    setupRoutes() {
        return this.factory
            .createApp()
            .basePath("/auth")
            .route("/", this.signupController.setupHandlers())
            .route("/", this.signinController.setupHandlers());
    }
}

const authRoutesInstance = new AuthRoutes();
export const authRoutes = authRoutesInstance.setupRoutes();
