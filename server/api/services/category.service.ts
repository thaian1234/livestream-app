import { CategoryDTO } from "../dtos/category.dto";
import { QueryDTO } from "../dtos/query.dto";
import { StreamToCategoriesDTO } from "../dtos/streamToCategories.dto";
import { Utils } from "../lib/helpers/utils";
import { ICategoryRepository } from "../repositories/category.repository";

export interface ICategoryService
    extends Utils.AutoMappedClass<CategoryService> {}
export class CategoryService implements ICategoryService {
    constructor(private categoryRepository: ICategoryRepository) {}
    public async findAll(query: QueryDTO.Filter) {
        return await this.categoryRepository.findAll(query);
    }
    public async findAllDetail(query: QueryDTO.Pagination) {
        return await this.categoryRepository.findAllDetail(query);
    }
    public async findOne(id: string) {
        return await this.categoryRepository.findOne(id);
    }
    public async createOne(data: CategoryDTO.Insert) {
        return await this.categoryRepository.createOne(data);
    }
    public async createMany(data: CategoryDTO.Insert[]) {
        return await this.categoryRepository.createMany(data);
    }
    public async update(id: string, data: CategoryDTO.Update) {
        return await this.categoryRepository.update(id, data);
    }
    public async delete(data: CategoryDTO.Delete) {
        return await this.categoryRepository.delete(data.id);
    }

    public async addCategoriesToStream(data: StreamToCategoriesDTO.Insert[]) {
        return this.categoryRepository.addCategoriesToStream(data);
    }
    public async deleteCategoriesFromStream(
        data: StreamToCategoriesDTO.DeleteCategoriesFromStream,
    ) {
        const result = await this.categoryRepository.deleteCategoryFromStream(
            data.streamId,
            data.categoryIds,
        );
        return result;
    }
    public async deleteAllCategoriesFromStream(streamId: string) {
        const result =
            await this.categoryRepository.deleteAllCategoriesFromStream(
                streamId,
            );
        return result;
    }
}
