import { CreateFactoryType } from "../lib/types/factory.type";

import { INotificationController } from "../controllers/notification.controller";

export class NotificationRoutes {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly notificationController: INotificationController,
    ) {}
    setupRoutes() {
        return this.factory
            .createApp()
            .route(
                "/notification",
                this.notificationController.setupHandlers(),
            );
    }
}
