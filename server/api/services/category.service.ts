import { CategoryDTO } from "../dtos/category.dto";
import { StreamToCategoriesDTO } from "../dtos/streamToCategories.dto";
import { Utils } from "../lib/helpers/utils";
import { ICategoryRepository } from "../repositories/category.repository";

export interface ICategoryService
    extends Utils.AutoMappedClass<CategoryService> {}
export class CategoryService implements ICategoryService {
    constructor(private categoryRepository: ICategoryRepository) {}
    public async findAll(
        filterBy: string = "",
        offset: number = 0,
        limit: number = 5,
    ) {
        return await this.categoryRepository.findAll(filterBy, offset, limit);
    }
    public async findAllDetail(offset: number = 0, limit: number = 10) {
        return await this.categoryRepository.findAllDetail(offset, limit);
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
        return await this.categoryRepository.addCategoriesToStream(data);
    }
    public async deleteCategoriesFromStream(
        data: StreamToCategoriesDTO.Delete[],
    ) {
        const deleteionPromises = data.map(({ categoryId, streamId }) =>
            this.categoryRepository.deleteCategoryFromStream(
                categoryId,
                streamId,
            ),
        );

        const results = await Promise.all(deleteionPromises);
        return results.every((result) => result === true);
    }
}
