import { CreateFactoryType } from "../lib/types/factory.type";

import { IBlockController } from "../controllers/block.controller";

export class BlockRoutes {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly blockController: IBlockController,
    ) {}
    setupRoutes() {
        return this.factory
            .createApp()
            .route("/blocks", this.blockController.setupHandlers());
    }
}

export type BlockRouteType = ReturnType<
    typeof BlockRoutes.prototype.setupRoutes
>;
