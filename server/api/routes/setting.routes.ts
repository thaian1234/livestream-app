import {
    ISettingController,
    SettingController,
} from "../controllers/setting.controller";
import { GetStreamService } from "../external-services/getstream.service";
import { CreateFactoryType } from "../lib/types/factory.type";
import { SettingRepository } from "../repositories/setting.repository";
import { SettingService } from "../services/setting.service";
import { createFactory } from "hono/factory";

class SettingRoutes {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly settingController: ISettingController,
    ) {}
    setupRoutes() {
        return this.factory
            .createApp()
            .route("/settings", this.settingController.setupHandlers());
    }
}

function createSettingContainer() {
    const factory = createFactory();
    // Repositories
    const settingRepository = new SettingRepository();
    // Services
    const settingService = new SettingService(settingRepository);
    const getStreamService = new GetStreamService();
    // Controllers
    const settingController = new SettingController(
        factory,
        settingService,
        getStreamService,
    );

    return new SettingRoutes(factory, settingController);
}

export const settingRoutes = createSettingContainer().setupRoutes();
