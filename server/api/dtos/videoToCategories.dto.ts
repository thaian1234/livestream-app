import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import tableSchemas from "@/server/db/schemas";

export class VideoToCategoriesDTO {
    private static baseSchema = createSelectSchema(
        tableSchemas.videosToCategoriesTable,
    );
    public static selectSchema = this.baseSchema;
    public static insertSchema = createInsertSchema(
        tableSchemas.videosToCategoriesTable,
    );
    public static deleteSchema = this.baseSchema.pick({
        categoryId: true,
        videoId: true,
    });
    public static deleteCategoriesFromVideoSchema = this.baseSchema
        .pick({
            videoId: true,
        })
        .extend({
            categoryIds: z.string().uuid().array(),
        });
    public static addCategoriesToVideoSchema = this.baseSchema
        .pick({
            videoId: true,
        })
        .extend({
            categoryIds: z.string().uuid().array(),
        });
}

export namespace VideoToCategoriesDTO {
    export type Insert = z.infer<typeof VideoToCategoriesDTO.insertSchema>;
    export type Delete = z.infer<typeof VideoToCategoriesDTO.deleteSchema>;
    export type Select = z.infer<typeof VideoToCategoriesDTO.selectSchema>;
    export type DeleteCategoriesFromVideo = z.infer<
        typeof VideoToCategoriesDTO.deleteCategoriesFromVideoSchema
    >;
    export type AddCategoriesToVideo = z.infer<
        typeof VideoToCategoriesDTO.addCategoriesToVideoSchema
    >;
}
