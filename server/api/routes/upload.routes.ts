import { CreateFactoryType } from "../lib/types/factory.type";

import { IUploadController } from "../controllers/upload.controller";

export class UploadRoutes {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly uploadController: IUploadController,
    ) {}
    setupRoutes() {
        return this.factory
            .createApp()
            .basePath("/upload")
            .route("/", this.uploadController.setupHandlers());
    }
}

export type UploadRouteType = ReturnType<
    typeof UploadRoutes.prototype.setupRoutes
>;
