import {
    IStreamController,
    StreamController,
} from "../controllers/stream.controller";
import { GetStreamService } from "../external-services/getstream.service";
import { CreateFactoryType } from "../lib/types/factory.type";
import { createFactory } from "hono/factory";

class StreamRoutes {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly streamController: IStreamController,
    ) {}
    setupRoutes() {
        return this.factory
            .createApp()
            .route("/streams", this.streamController.setupHandlers());
    }
}

function createStreamContainer() {
    const factory = createFactory();
    // Services
    const getStreamService = new GetStreamService();
    // Controllers
    const streamController = new StreamController(factory, getStreamService);

    return new StreamRoutes(factory, streamController);
}

export const streamRoutes = createStreamContainer().setupRoutes();
