import { CategoryDTO } from "../dtos/category.dto";
import { StreamToCategoriesDTO } from "../dtos/streamToCategories.dto";
import { Utils } from "../lib/helpers/utils";
import { and, eq, ilike, inArray, or } from "drizzle-orm";

import Database from "@/server/db";
import tableSchemas from "@/server/db/schemas";

export interface ICategoryRepository
    extends Utils.AutoMappedClass<CategoryRepository> {}
export class CategoryRepository implements ICategoryRepository {
    private db;
    constructor() {
        this.db = Database.getInstance().db;
    }

    async findAll(
        filterBy: string = "",
        offset: number = 0,
        limit: number = 5,
    ) {
        try {
            const categories = await this.db.query.categoryTable.findMany({
                where: and(
                    eq(tableSchemas.categoryTable.isActive, true),
                    ilike(tableSchemas.categoryTable.name, `%${filterBy}%`),
                ),
                offset: offset,
                limit: limit,
            });
            return categories;
        } catch (error) {}
    }
    async findAllDetail(offset: number = 0, limit: number = 10) {
        try {
            const categories = await this.db.query.categoryTable.findMany({
                where: eq(tableSchemas.categoryTable.isActive, true),
                with: {
                    children: true,
                    parent: true,
                },
                offset,
                limit,
            });
            return categories;
        } catch (error) {}
    }
    async findOne(id: string) {
        try {
            const category = await this.db.query.categoryTable.findFirst({
                where: and(
                    eq(tableSchemas.categoryTable.isActive, true),
                    eq(tableSchemas.categoryTable.id, id),
                ),
            });
            return category;
        } catch (error) {}
    }
    async createOne(data: CategoryDTO.Insert) {
        try {
            const [category] = await this.db
                .insert(tableSchemas.categoryTable)
                .values(data)
                .returning();
            return category;
        } catch (error) {}
    }
    async createMany(data: CategoryDTO.Insert[]) {
        try {
            const categories = await this.db
                .insert(tableSchemas.categoryTable)
                .values(data)
                .returning();
            return categories;
        } catch (error) {}
    }
    async update(id: string, data: CategoryDTO.Update) {
        try {
            const [category] = await this.db
                .update(tableSchemas.categoryTable)
                .set(data)
                .where(eq(tableSchemas.categoryTable.id, id))
                .returning();
            return category;
        } catch (error) {}
    }
    async delete(id: string) {
        try {
            const rows = await this.db
                .update(tableSchemas.categoryTable)
                .set({
                    isActive: false,
                })
                .where(eq(tableSchemas.categoryTable.id, id))
                .returning();
            return !(rows.length === 0);
        } catch (error) {}
    }
    async addCategoriesToStream(data: StreamToCategoriesDTO.Insert[]) {
        try {
            const streamCategories = await this.db
                .insert(tableSchemas.streamsToCategoriesTable)
                .values(data)
                .returning();
            return streamCategories;
        } catch (error) {
            console.error("Error adding categories to stream:", error);
            return [];
        }
    }
    async deleteCategoryFromStream(streamId: string, categoryIds: string[]) {
        try {
            const rows = await this.db
                .delete(tableSchemas.streamsToCategoriesTable)
                .where(
                    and(
                        eq(
                            tableSchemas.streamsToCategoriesTable.streamId,
                            streamId,
                        ),
                        inArray(
                            tableSchemas.streamsToCategoriesTable.categoryId,
                            categoryIds,
                        ),
                    ),
                )
                .returning();
            return rows.length > 0;
        } catch (error) {
            console.error("Error deleting categories from stream:", error);
            return false;
        }
    }
}
