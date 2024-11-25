import {
    INotificationController,
    NotificationController,
} from "../controllers/notification.controller";
import { NotificationService } from "../external-services/notification.service";
import { CreateFactoryType } from "../lib/types/factory.type";
import { createFactory } from "hono/factory";

class NotificationRoutes {
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
