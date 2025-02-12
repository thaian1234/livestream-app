import { createFactory } from "hono/factory";

import { CreateFactoryType } from "../lib/types/factory.type";

import { BlockRepository } from "../repositories/block.repository";
import { FollowRepository } from "../repositories/follow.repository";
import { SettingRepository } from "../repositories/setting.repository";
import { StreamRepository } from "../repositories/stream.repository";
import { UserRepository } from "../repositories/user.repository";

import { BlockService } from "../services/block.service";
import { FollowService } from "../services/follow.service";
import { SettingService } from "../services/setting.service";
import { StreamService } from "../services/stream.service";
import { UserService } from "../services/user.service";

import {
    IUserController,
    UserController,
} from "../controllers/user.controller";

import { AuthMiddleware } from "../middleware/auth.middleware";

export class UserRoutes {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly userController: IUserController,
    ) {}
    setupRoutes() {
        return this.factory
            .createApp()
            .route("/users", this.userController.setupHandlers());
    }
}

function createUserRoutes(): UserRoutes {
    const factory = createFactory();
    const userRepository = new UserRepository();
    const followRepository = new FollowRepository();
    const blockRepository = new BlockRepository();
    const streamRepository = new StreamRepository();
    const settingRepository = new SettingRepository();

    const userService = new UserService(userRepository);
    const blockService = new BlockService(blockRepository);
    const followService = new FollowService(followRepository, blockService);
    const streamService = new StreamService(streamRepository);
    const settingService = new SettingService(settingRepository);
    const userController = new UserController(
        factory,
        userService,
        followService,
        streamService,
        settingService,
    );

    return new UserRoutes(factory, userController);
}

export const userRoutes = createUserRoutes().setupRoutes();
