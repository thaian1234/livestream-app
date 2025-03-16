import { CreateFactoryType } from "../lib/types/factory.type";

import { IVideoController } from "../controllers/video.controller";

export class VideoRoutes {
    constructor(
        private factory: CreateFactoryType,
        private videoController: IVideoController,
    ) {}
    public setupRoutes() {
        return this.factory
            .createApp()
            .route("/videos", this.videoController.setupHandlers());
    }
}

export type VideoRouteType = ReturnType<
    typeof VideoRoutes.prototype.setupRoutes
>;
