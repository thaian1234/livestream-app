import { CreateFactoryType } from "../lib/types/factory.type";

import { IStreamController } from "../controllers/stream.controller";

export class StreamRoutes {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly streamController: IStreamController,
    ) {}
    setupRoutes() {
        return this.factory
            .createApp()
            .route("/streams", this.streamController.setupHandlers());
    }
}
