import { CreateFactoryType } from "../lib/types/factory.type";

import { ICategoryController } from "../controllers/category.controller";

export class CategoryRoutes {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly categoryController: ICategoryController,
    ) {}
    setupRoutes() {
        return this.factory
            .createApp()
            .route("/categories", this.categoryController.setupHandlers());
    }
}

export type CategoryRouteType = ReturnType<
    typeof CategoryRoutes.prototype.setupRoutes
>;
