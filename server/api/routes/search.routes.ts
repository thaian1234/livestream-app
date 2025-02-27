import { CreateFactoryType } from "../lib/types/factory.type";

import { ISearchController } from "../controllers/search.controller";

export class SearchRoutes {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly searchController: ISearchController,
    ) {}
    setupRoutes() {
        return this.factory
            .createApp()
            .route("/search", this.searchController.setupHandlers());
    }
}
