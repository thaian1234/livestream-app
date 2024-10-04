import {
    IUserController,
    UserController,
} from "../controllers/user.controller";
import { CreateFactoryType } from "../lib/types/factory.type";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { BlockRepository } from "../repositories/block.repository";
import { FollowRepository } from "../repositories/follow.repository";
import { StreamRepository } from "../repositories/stream.repository";
import { UserRepository } from "../repositories/user.repository";
import { BlockService } from "../services/block.service";
import { FollowService } from "../services/follow.service";
import { StreamService } from "../services/stream.service";
import { UserService } from "../services/user.service";
import { createFactory } from "hono/factory";

class UserRoutes {
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
    const userService = new UserService(userRepository);
    const blockService = new BlockService(blockRepository);
    const followService = new FollowService(followRepository, blockService);
    const streamService = new StreamService(streamRepository);
    const userController = new UserController(
        factory,
        userService,
        followService,
        streamService,
        blockService,
    );

    return new UserRoutes(factory, userController);
}

export const userRoutes = createUserRoutes().setupRoutes();
