import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";

import tableSchemas from "@/server/db/schemas";

export class StorageDTO {
    private static baseSchema = createSelectSchema(tableSchemas.storageTable, {
        createdAt: z.date().transform((date) => date.toISOString()),
        updatedAt: z.date().transform((date) => date.toISOString()),
        startTime: z.date().transform((date) => date.toISOString()),
        endTime: z.date().transform((date) => date.toISOString()),
    });
    public static selectSchema = this.baseSchema;
    public static insertSchema = createInsertSchema(tableSchemas.storageTable);
    public static updateSchema = createUpdateSchema(
        tableSchemas.storageTable,
    ).omit({
        createdAt: true,
        updatedAt: true,
    });
    public static deleteSchema = this.baseSchema.pick({
        id: true,
    });
}

export namespace StorageDTO {
    export type Select = z.infer<typeof StorageDTO.selectSchema>;
    export type Insert = z.infer<typeof StorageDTO.insertSchema>;
    export type Update = z.infer<typeof StorageDTO.updateSchema>;
    export type Delete = z.infer<typeof StorageDTO.deleteSchema>;
}
