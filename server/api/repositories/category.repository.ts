import { CategoryDTO } from "../dtos/category.dto";
import { Utils } from "../lib/helpers/utils";
import { and, eq } from "drizzle-orm";

import Database from "@/server/db";
import tableSchemas from "@/server/db/schemas";
import { StreamToCategoriesDTO } from "../dtos/streamToCategories.dto";

export interface ICategoryRepository
    extends Utils.AutoMappedClass<CategoryRepository> {}
export class CategoryRepository implements ICategoryRepository {
    private db;
    constructor() {
        this.db = Database.getInstance().db;
    }

    async findAll() {
        try {
            const categories = await this.db.query.categoryTable.findMany();
            return categories;
        } catch (error) {}
    }
    async findOne(id: string) {
        try {
            const category = await this.db.query.categoryTable.findFirst({
                where: eq(tableSchemas.categoryTable.id, id),
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
            const streamCategory = await this.db
                .insert(tableSchemas.streamsToCategoriesTable)
                .values(data)
                .returning();
            return streamCategory;
        } catch (error) {}
    }
    async deleteCategoryFromStream(categoryId: string, streamId: string) {
        try {
            const rows = await this.db
                .delete(tableSchemas.streamsToCategoriesTable)
                .where(
                    and(
                        eq(
                            tableSchemas.streamsToCategoriesTable.categoryId,
                            categoryId,
                        ),
                        eq(
                            tableSchemas.streamsToCategoriesTable.streamId,
                            streamId,
                        ),
                    ),
                )
                .returning();
            return !(rows.length === 0);
        } catch (error) {}
    }
}
