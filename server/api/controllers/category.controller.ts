import { CategoryDTO } from "../dtos/category.dto";
import { QueryDTO } from "../dtos/query.dto";
import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { Validator } from "../lib/validations/validator";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { ICategoryService } from "../services/category.service";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export interface ICategoryController
    extends Utils.PickMethods<CategoryController, "setupHandlers"> {}

export class CategoryController implements ICategoryController {
    constructor(
        private factory: CreateFactoryType,
        private categoryService: ICategoryService,
    ) {}
    setupHandlers() {
        return this.factory
            .createApp()
            .get("/", ...this.getAllCategoryBasicData())
            .get("/detail", ...this.getAllCategoryDetailData())
            .get("/:categoryId", ...this.getCategoryById())
            .post("/", ...this.addCategory())
            .delete("/:categoryId", ...this.deleteCategory())
            .patch("/", ...this.updateCategory());
    }
    private getAllCategoryBasicData() {
        const queries = QueryDTO.createFilterSchema(1, 5);
        return this.factory.createHandlers(
            zValidator("query", queries, Validator.handleParseError),
            async (c) => {
                const { page, size, filterBy } = c.req.valid("query");
                const categories = await this.categoryService.findAll(
                    filterBy || "",
                    (page - 1) * size,
                    size,
                );
                if (!categories) {
                    throw new MyError.BadRequestError(
                        "Failed to fetch categories",
                    );
                }
                return ApiResponse.WriteJSON({
                    c,
                    data: {
                        categories: CategoryDTO.parseManyBasic(categories),
                    },
                    status: HttpStatus.OK,
                });
            },
        );
    }
    private getAllCategoryDetailData() {
        const queries = QueryDTO.createPaginationSchema(1, 15);
        return this.factory.createHandlers(
            zValidator("query", queries, Validator.handleParseError),
            async (c) => {
                const { page, size } = c.req.valid("query");
                const categories = await this.categoryService.findAllDetail(
                    (page - 1) * size,
                    size,
                );
                if (!categories) {
                    throw new MyError.BadRequestError(
                        "Failed to fetch categories",
                    );
                }
                console.log(categories);
                console.log("here");
                return ApiResponse.WriteJSON({
                    c,
                    data: {
                        categories: CategoryDTO.parseManyDetail(categories),
                    },
                    status: HttpStatus.OK,
                });
            },
        );
    }
    private getCategoryById() {
        const params = z.object({
            categoryId: z.string().trim().min(1),
        });
        return this.factory.createHandlers(
            zValidator("param", params, Validator.handleParseError),
            async (c) => {
                const { categoryId } = c.req.valid("param");

                const category = await this.categoryService.findOne(categoryId);
                if (!category) {
                    throw new MyError.BadRequestError("Category not found");
                }

                return ApiResponse.WriteJSON({
                    c,
                    data: {
                        category: CategoryDTO.parse(category),
                    },
                    status: HttpStatus.OK,
                });
            },
        );
    }
    private addCategory() {
        return this.factory.createHandlers(
            zValidator(
                "json",
                CategoryDTO.insertSchema,
                Validator.handleParseError,
            ),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const jsonData = c.req.valid("json");

                const category = await this.categoryService.createOne(jsonData);
                if (!category) {
                    throw new MyError.BadRequestError(
                        "Failed to create category",
                    );
                }

                return ApiResponse.WriteJSON({
                    c,
                    data: {
                        categoryId: category.id,
                    },
                    status: HttpStatus.Created,
                });
            },
        );
    }
    private deleteCategory() {
        const params = z.object({
            categoryId: z.string().trim().min(1),
        });
        return this.factory.createHandlers(
            zValidator("param", params, Validator.handleParseError),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const { categoryId } = c.req.valid("param");

                const isSuccess = await this.categoryService.delete({
                    id: categoryId,
                });

                if (!isSuccess) {
                    throw new MyError.BadRequestError(
                        "Failed to delete category",
                    );
                }

                return ApiResponse.WriteJSON({
                    c,
                    data: undefined,
                    status: HttpStatus.OK,
                    msg: "Delete category successfully",
                });
            },
        );
    }
    private updateCategory() {
        const params = z.object({
            categoryId: z.string().trim().min(1),
        });
        return this.factory.createHandlers(
            zValidator("param", params, Validator.handleParseError),
            zValidator(
                "json",
                CategoryDTO.updateSchema,
                Validator.handleParseError,
            ),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const { categoryId } = c.req.valid("param");
                const jsonData = c.req.valid("json");

                const category = await this.categoryService.update(
                    categoryId,
                    jsonData,
                );

                if (!category) {
                    throw new MyError.BadRequestError(
                        "Failed to update category",
                    );
                }

                return ApiResponse.WriteJSON({
                    c,
                    data: {
                        category: category,
                    },
                    status: HttpStatus.OK,
                    msg: "Delete category successfully",
                });
            },
        );
    }
}
