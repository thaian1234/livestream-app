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
            .route("/categorys", this.categoryController.setupHandlers());
    }
}
