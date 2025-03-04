import { CreateFactoryType } from "../lib/types/factory.type";

import { IUserController } from "../controllers/user.controller";

export class UserRoutes {
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
