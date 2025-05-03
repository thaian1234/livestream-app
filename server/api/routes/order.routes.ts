import { CreateFactoryType } from "../lib/types/factory.type";

import { IOrderController } from "../controllers/order.controller";

export class OrderRoutes {
    constructor(
        private factory: CreateFactoryType,
        private orderController: IOrderController,
    ) {}
    public setupRoutes() {
        return this.factory
            .createApp()
            .route("/orders", this.orderController.setupHandlers());
    }
}

export type OrderRouteType = ReturnType<
    typeof OrderRoutes.prototype.setupRoutes
>;
