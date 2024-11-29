import {
    ICategoryController,
    CategoryController,
} from "../controllers/category.controller";
import { CreateFactoryType } from "../lib/types/factory.type";
import { CategoryRepository } from "../repositories/category.repository";
import { CategoryService } from "../services/category.service";
import { createFactory } from "hono/factory";

class CategoryRoutes {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly categoryController: ICategoryController,
    ) {}
    setupRoutes() {
        return this.factory
            .createApp()
            .route("/categorys", this.categoryController.setupHandlers());
    }
}

function createCategoryContainer() {
    const factory = createFactory();
    // Repositories
    const categoryRepository = new CategoryRepository();
    // Services
    const categoryService = new CategoryService(categoryRepository);
    // Controllers
    const categoryController = new CategoryController(
        factory,
        categoryService,
    );

    return new CategoryRoutes(factory, categoryController);
}

export const categoryRoutes = createCategoryContainer().setupRoutes();
