import { CreateFactoryType } from "../lib/types/factory.type";

import { IStorageController } from "../controllers/storage.controller";

export class StorageRoutes {
    constructor(
        private factory: CreateFactoryType,
        private storageController: IStorageController,
    ) {}
    public setupRoutes() {
        return this.factory
            .createApp()
            .route("/storages", this.storageController.setupHandlers());
    }
}
