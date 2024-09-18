import {
    BlockController,
    IBlockController,
} from "../controllers/block.controller";
import { CreateFactoryType } from "../lib/types/factory.type";
import { BlockRepository } from "../repositories/block.repository";
import { BlockService } from "../services/block.service";
import { createFactory } from "hono/factory";

class BlockRoutes {
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
    const blockRepository = new BlockRepository();
    const blockService = new BlockService(blockRepository);
    const blockController = new BlockController(factory, blockService);

    return new BlockRoutes(factory, blockController);
}

export const blockRoutes = createBlockRoutes().setupRoutes();
