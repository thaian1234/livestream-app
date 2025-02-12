import { createFactory } from "hono/factory";

import { CreateFactoryType } from "../lib/types/factory.type";

import { SettingRepository } from "../repositories/setting.repository";

import { SettingService } from "../services/setting.service";

import { GetStreamService } from "../external-services/getstream.service";

import {
    ISettingController,
    SettingController,
} from "../controllers/setting.controller";

export class SettingRoutes {
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
