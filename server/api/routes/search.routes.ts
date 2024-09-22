import {
    ISearchController,
    SearchController,
} from "../controllers/search.controller";
import { CreateFactoryType } from "../lib/types/factory.type";
import { UserRepository } from "../repositories/user.repository";
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
    const searchController = new SearchController(factory, userService);

    return new SearchRoutes(factory, searchController);
}

export const searchRoutes = createSearchRoutes().setupRoutes();
