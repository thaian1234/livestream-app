import {
    ISearchController,
    SearchController,
} from "../controllers/search.controller";
import { CreateFactoryType } from "../lib/types/factory.type";
import { StreamRepository } from "../repositories/stream.repository";
import { UserRepository } from "../repositories/user.repository";
import { StreamService } from "../services/stream.service";
import { UserService } from "../services/user.service";
import { createFactory } from "hono/factory";

class SearchRoutes {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly searchController: ISearchController,
    ) {}
    setupRoutes() {
        return this.factory
            .createApp()
            .route("/search", this.searchController.setupHandlers());
    }
}

function createSearchRoutes(): SearchRoutes {
    const factory = createFactory();
    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);
    const streamRepository = new StreamRepository();
    const streamService = new StreamService(streamRepository);
    const searchController = new SearchController(
        factory,
        userService,
        streamService,
    );

    return new SearchRoutes(factory, searchController);
}

export const searchRoutes = createSearchRoutes().setupRoutes();
