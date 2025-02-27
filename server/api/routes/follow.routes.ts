import { CreateFactoryType } from "../lib/types/factory.type";

import { IFollowController } from "../controllers/follow.controller";

export class FollowRoutes {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly followController: IFollowController,
    ) {}
    setupRoutes() {
        return this.factory
            .createApp()
            .route("/follows", this.followController.setupHandlers());
    }
}
