import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import tableSchemas from "@/server/db/schemas";

export class CategoryDTO {
    private static baseSchema = createSelectSchema(tableSchemas.categoryTable);
    public static selectSchema = this.baseSchema;
    public static insertSchema = createInsertSchema(tableSchemas.categoryTable);
    public static deleteSchema = this.baseSchema.pick({
        id: true,
    });
    public static updateSchema = this.baseSchema.partial().omit({
        id: true,
    });
    public static parseMany(data: unknown) {
        return this.selectSchema.array().parse(data);
    }
    public static parse(data: unknown) {
        return this.selectSchema.parse(data);
    }
}

export namespace CategoryDTO {
    export type Insert = z.infer<typeof CategoryDTO.insertSchema>;
    export type Update = z.infer<typeof CategoryDTO.updateSchema>;
    export type Delete = z.infer<typeof CategoryDTO.deleteSchema>;
    export type Select = z.infer<typeof CategoryDTO.selectSchema>;
}
