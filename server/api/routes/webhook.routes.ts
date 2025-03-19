import { CreateFactoryType } from "../lib/types/factory.type";

import { WebhookController } from "../controllers/webhook.controller";

export class WebhookRoutes {
    constructor(
        private factory: CreateFactoryType,
        private webhookController: WebhookController,
    ) {}
    public setupRoutes() {
        return this.factory
            .createApp()
            .route("/webhook", this.webhookController.setupHandlers());
    }
}

export type WebhookRouteType = ReturnType<
    typeof WebhookRoutes.prototype.setupRoutes
>;
