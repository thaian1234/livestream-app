import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import tableSchemas from "@/server/db/schemas";

export class StreamToCategoriesDTO {
    private static baseSchema = createSelectSchema(
        tableSchemas.streamsToCategoriesTable,
    );
    public static selectSchema = this.baseSchema;
    public static insertSchema = createInsertSchema(
        tableSchemas.streamsToCategoriesTable,
    );
    public static deleteSchema = this.baseSchema.pick({
        categoryId: true,
        streamId: true,
    });
    public static deleteCategoriesFromStreamSchema = this.baseSchema
        .pick({
            streamId: true,
        })
        .extend({
            categoryIds: z.string().uuid().array(),
        });
    public static addCategoriesToStreamSchema = this.baseSchema
        .pick({
            streamId: true,
        })
        .extend({
            categoryIds: z.string().uuid().array(),
        });
}

export namespace StreamToCategoriesDTO {
    export type Insert = z.infer<typeof StreamToCategoriesDTO.insertSchema>;
    export type Delete = z.infer<typeof StreamToCategoriesDTO.deleteSchema>;
    export type Select = z.infer<typeof StreamToCategoriesDTO.selectSchema>;
    export type DeleteCategoriesFromStream = z.infer<
        typeof StreamToCategoriesDTO.deleteCategoriesFromStreamSchema
    >;
    export type AddCategoriesToStream = z.infer<
        typeof StreamToCategoriesDTO.addCategoriesToStreamSchema
    >;
}
