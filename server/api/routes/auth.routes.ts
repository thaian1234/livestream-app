import { CreateFactoryType } from "../lib/types/factory.type";

import { IAuthController } from "../controllers/auth.controller";
import { IOauthController } from "../controllers/oauth.controller";

export class AuthRoutes {
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
