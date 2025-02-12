import { createFactory } from "hono/factory";

import { CreateFactoryType } from "../lib/types/factory.type";

import { BlockRepository } from "../repositories/block.repository";
import { FollowRepository } from "../repositories/follow.repository";

import { BlockService } from "../services/block.service";
import { FollowService } from "../services/follow.service";

import { NotificationService } from "../external-services/notification.service";

import {
    FollowController,
    IFollowController,
} from "../controllers/follow.controller";

export class FollowRoutes {
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
    const notificationService = new NotificationService();
    const followController = new FollowController(
        factory,
        followService,
        notificationService,
    );

    return new FollowRoutes(factory, followController);
}

export const followRoutes = createFollowRoutes().setupRoutes();
