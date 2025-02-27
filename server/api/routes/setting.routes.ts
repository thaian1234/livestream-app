import { CreateFactoryType } from "../lib/types/factory.type";

import { ISettingController } from "../controllers/setting.controller";

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
