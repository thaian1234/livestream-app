import { CreateFactoryType } from "../lib/types/factory.type";

import { IVideoLikeController } from "../controllers/video-like.controller";

export class VideoLikeRoutes {
    constructor(
        private factory: CreateFactoryType,
        private videolikeController: IVideoLikeController,
    ) {}
    public setupRoutes() {
        return this.factory
            .createApp()
            .route("/videolikes", this.videolikeController.setupHandlers());
    }
}

export type VideoLikeRouteType = ReturnType<
    typeof VideoLikeRoutes.prototype.setupRoutes
>;
