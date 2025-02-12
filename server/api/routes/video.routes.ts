import { IVideoController } from "../controllers/video.controller";
import { CreateFactoryType } from "../lib/types/factory.type";

class VideoRoutes {
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

function createVideoRoutes() {}
