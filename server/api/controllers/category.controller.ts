import { CategoryDTO } from "../dtos/category.dto";
import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { ICategoryService } from "../services/category.service";

export interface ICategoryController
    extends Utils.PickMethods<CategoryController, "setupHandlers"> {}

export class CategoryController implements ICategoryController {
    constructor(
        private factory: CreateFactoryType,
        private categoryService: ICategoryService,
    ) {}
    setupHandlers() {
        return this.factory.createApp().get("/", ...this.getAllCategory());
    }
    private getAllCategory() {
        return this.factory.createHandlers(
            async (c) => {
                const categories = this.categoryService.findAll();
                if (!categories) {
                    throw new MyError.BadRequestError("Failed to fetch categories")
                }
                return ApiResponse.WriteJSON({
                    c,
                    data: {
                        categories: CategoryDTO.parseMany(categories)
                    },
                    status: HttpStatus.OK
                })
            }
        ) 
    }
    private getCategoryById() {
        
    }
    private addCategory() {

    }
    private deleteCategory() {

    }
    private updateCategory() {

    }

    private addCategoriesToStream() {

    }
    private deleteCategoriesFromStream() {

    }
}
