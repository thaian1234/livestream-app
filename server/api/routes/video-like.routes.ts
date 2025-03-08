import { IVideoLikeController } from "../controllers/video-like.controller";
import { CreateFactoryType } from "../lib/types/factory.type";

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
