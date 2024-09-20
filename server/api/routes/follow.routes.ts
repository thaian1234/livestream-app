import {
    FollowController,
    IFollowController,
} from "../controllers/follow.controller";
import { CreateFactoryType } from "../lib/types/factory.type";
import { BlockRepository } from "../repositories/block.repository";
import { FollowRepository } from "../repositories/follow.repository";
import { BlockService } from "../services/block.service";
import { FollowService } from "../services/follow.service";
import { createFactory } from "hono/factory";

class FollowRoutes {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly followController: IFollowController,
    ) {}
    setupRoutes() {
        return this.factory
            .createApp()
            .route("/follows", this.followController.setupHandlers());
    }
}

function createFollowRoutes(): FollowRoutes {
    const factory = createFactory();
    const followRepository = new FollowRepository();
    const blockRepository = new BlockRepository();
    const blockService = new BlockService(blockRepository);
    const followService = new FollowService(followRepository, blockService);
    const followController = new FollowController(factory, followService);

    return new FollowRoutes(factory, followController);
}

export const followRoutes = createFollowRoutes().setupRoutes();
