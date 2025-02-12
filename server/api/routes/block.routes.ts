import { createFactory } from "hono/factory";

import { CreateFactoryType } from "../lib/types/factory.type";

import { BlockRepository } from "../repositories/block.repository";

import { BlockService } from "../services/block.service";

import { NotificationService } from "../external-services/notification.service";

import {
    BlockController,
    IBlockController,
} from "../controllers/block.controller";

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

function createBlockRoutes(): BlockRoutes {
    const factory = createFactory();
    // Repository
    const blockRepository = new BlockRepository();
    // Service
    const blockService = new BlockService(blockRepository);
    const notificationService = new NotificationService();
    // Controller
    const blockController = new BlockController(
        factory,
        blockService,
        notificationService,
    );

    return new BlockRoutes(factory, blockController);
}

export const blockRoutes = createBlockRoutes().setupRoutes();
