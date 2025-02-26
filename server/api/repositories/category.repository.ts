import { CategoryDTO } from "../dtos/category.dto";
import { QueryDTO } from "../dtos/query.dto";
import { StreamToCategoriesDTO } from "../dtos/streamToCategories.dto";
import { Utils } from "../lib/helpers/utils";
import {
    SQL,
    and,
    eq,
    getTableColumns,
    ilike,
    inArray,
    isNull,
    notInArray,
    or,
    sql,
} from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";
import { SQLiteTable } from "drizzle-orm/sqlite-core";

import Database from "@/server/db";
import tableSchemas from "@/server/db/schemas";
import { VideoToCategoriesDTO } from "../dtos/videoToCategories.dto";

const buildConflictUpdateColumns = <
    T extends PgTable | SQLiteTable,
    Q extends keyof T["_"]["columns"],
>(
    table: T,
    columns: Q[],
) => {
    const cls = getTableColumns(table);
    return columns.reduce(
        (acc, column) => {
            const colName = cls[column].name;
            acc[column] = sql.raw(`excluded.${colName}`);
            return acc;
        },
        {} as Record<Q, SQL>,
    );
};

export interface ICategoryRepository
    extends Utils.AutoMappedClass<CategoryRepository> {}
export class CategoryRepository implements ICategoryRepository {
    private db;
    constructor() {
        this.db = Database.getInstance().db;
    }

    async findAll(query: QueryDTO.Filter) {
        try {
            const categories = await this.db.query.categoryTable.findMany({
                where: and(
                    eq(tableSchemas.categoryTable.isActive, true),
                    ilike(
                        tableSchemas.categoryTable.name,
                        `%${query.filterBy}%`,
                    ),
                ),
                offset: (query.page - 1) * query.size,
                limit: query.size,
            });
            return categories;
        } catch (error) {}
    }
    async findAllDetail(query: QueryDTO.Pagination) {
        try {
            const categories = await this.db.query.categoryTable.findMany({
                where: and(
                    eq(tableSchemas.categoryTable.isActive, true),
                    isNull(tableSchemas.categoryTable.parentId),
                ),
                with: {
                    children: {
                        where: eq(tableSchemas.categoryTable.isActive, true),
                        with: {
                            children: true,
                        },
                    },
                },
                offset: (query.page - 1) * query.size,
                limit: query.size,
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
            return this.db.transaction(async (tx) => {
                const categoryIds = data.map((item) => item.categoryId);
                const streamId = data[0].streamId;

                await tx
                    .delete(tableSchemas.streamsToCategoriesTable)
                    .where(
                        and(
                            eq(
                                tableSchemas.streamsToCategoriesTable.streamId,
                                streamId,
                            ),
                            notInArray(
                                tableSchemas.streamsToCategoriesTable
                                    .categoryId,
                                categoryIds,
                            ),
                        ),
                    );
                await this.db
                    .insert(tableSchemas.streamsToCategoriesTable)
                    .values(data)
                    .onConflictDoUpdate({
                        target: [
                            tableSchemas.streamsToCategoriesTable.streamId,
                            tableSchemas.streamsToCategoriesTable.categoryId,
                        ],
                        set: buildConflictUpdateColumns(
                            tableSchemas.streamsToCategoriesTable,
                            ["streamId", "categoryId", "createdAt"],
                        ),
                    });
                return true;
            });
        } catch (error) {
            console.error("Error adding categories to stream:", error);
            return false;
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
    async deleteAllCategoriesFromStream(streamId: string) {
        try {
            const rows = await this.db
                .delete(tableSchemas.streamsToCategoriesTable)
                .where(
                    eq(
                        tableSchemas.streamsToCategoriesTable.streamId,
                        streamId,
                    ),
                )
                .returning();
            return rows.length > 0;
        } catch (error) {
            console.error("Error deleting categories from stream:", error);
            return false;
        }
    }
    async addCategoriesToVideo(data: VideoToCategoriesDTO.Insert[]) {
        try {
            return this.db.transaction(async (tx) => {
                const categoryIds = data.map((item) => item.categoryId);
                const videoId = data[0].videoId;

                await tx
                    .delete(tableSchemas.videosToCategoriesTable)
                    .where(
                        and(
                            eq(
                                tableSchemas.videosToCategoriesTable.videoId,
                                videoId,
                            ),
                            notInArray(
                                tableSchemas.videosToCategoriesTable
                                    .categoryId,
                                categoryIds,
                            ),
                        ),
                    );
                await this.db
                    .insert(tableSchemas.videosToCategoriesTable)
                    .values(data)
                    .onConflictDoUpdate({
                        target: [
                            tableSchemas.videosToCategoriesTable.videoId,
                            tableSchemas.videosToCategoriesTable.categoryId,
                        ],
                        set: buildConflictUpdateColumns(
                            tableSchemas.videosToCategoriesTable,
                            ["videoId", "categoryId", "createdAt"],
                        ),
                    });
                return true;
            });
        } catch (error) {
            console.error("Error adding categories to video:", error);
            return false;
        }
    }
    async deleteAllCategoriesFromVideo(videoId: string) {
        try {
            const rows = await this.db
                .delete(tableSchemas.videosToCategoriesTable)
                .where(
                    eq(
                        tableSchemas.videosToCategoriesTable.videoId,
                        videoId,
                    ),
                )
                .returning();
            return rows.length > 0;
        } catch (error) {
            console.error("Error deleting categories from video:", error);
            return false;
        }
    }
}
