import { CreateFactoryType } from "../lib/types/factory.type";

import { IEventController } from "../controllers/event.controller";

export class EventRoutes {
    constructor(
        private factory: CreateFactoryType,
        private eventController: IEventController,
    ) {}
    public setupRoutes() {
        return this.factory
            .createApp()
            .route("/events", this.eventController.setupHandlers());
    }
}
