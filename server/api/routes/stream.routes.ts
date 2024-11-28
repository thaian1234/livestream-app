import {
    IStreamController,
    StreamController,
} from "../controllers/stream.controller";
import { GetStreamService } from "../external-services/getstream.service";
import { NotificationService } from "../external-services/notification.service";
import { CreateFactoryType } from "../lib/types/factory.type";
import { FollowRepository } from "../repositories/follow.repository";
import { SettingRepository } from "../repositories/setting.repository";
import { StreamRepository } from "../repositories/stream.repository";
import { SettingService } from "../services/setting.service";
import { StreamService } from "../services/stream.service";
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
    // Repositories
    const streamRepository = new StreamRepository();
    const settingRepository = new SettingRepository();
    const followRepository = new FollowRepository();
    // Services
    const getStreamService = new GetStreamService();
    const streamService = new StreamService(streamRepository);
    const settingService = new SettingService(settingRepository);
    const notificationService = new NotificationService();
    // Controllers
    const streamController = new StreamController(
        factory,
        streamService,
        getStreamService,
        settingService,
        followRepository,
        notificationService,
    );

    return new StreamRoutes(factory, streamController);
}

export const streamRoutes = createStreamContainer().setupRoutes();
