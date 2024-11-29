import {
    IStreamController,
    StreamController,
} from "../controllers/stream.controller";
import { GetStreamService } from "../external-services/getstream.service";
import { CreateFactoryType } from "../lib/types/factory.type";
import { CategoryRepository } from "../repositories/category.repository";
import { SettingRepository } from "../repositories/setting.repository";
import { StreamRepository } from "../repositories/stream.repository";
import { CategoryService } from "../services/category.service";
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
    const categoryRepository = new CategoryRepository();
    // Services
    const getStreamService = new GetStreamService();
    const streamService = new StreamService(streamRepository);
    const settingService = new SettingService(settingRepository);
    const categoryService = new CategoryService(categoryRepository);
    // Controllers
    const streamController = new StreamController(
        factory,
        streamService,
        getStreamService,
        settingService,
        categoryService,
    );

    return new StreamRoutes(factory, streamController);
}

export const streamRoutes = createStreamContainer().setupRoutes();
