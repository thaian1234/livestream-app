import { createFactory } from "hono/factory";

import { CreateFactoryType } from "../lib/types/factory.type";

import { NotificationService } from "../external-services/notification.service";

import {
    INotificationController,
    NotificationController,
} from "../controllers/notification.controller";

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
function createNotificationRoutes(): NotificationRoutes {
    const factory = createFactory();
    // Services
    const notificationService = new NotificationService();
    const notificationController = new NotificationController(
        factory,
        notificationService,
    );
    return new NotificationRoutes(factory, notificationController);
}

export const notificationRoutes = createNotificationRoutes().setupRoutes();
