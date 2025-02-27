import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";

import tableSchemas, { tableRelations } from "@/server/db/schemas";

export class VideoDTO {
    private static baseSchema = createSelectSchema(tableSchemas.videoTable, {
        createdAt: z.date().transform((date) => date.toISOString()),
        updatedAt: z.date().transform((date) => date.toISOString()),
    });
    public static selectSchema = this.baseSchema.omit({});
    public static insertSchema = createInsertSchema(tableSchemas.videoTable);
    public static updateSchema = createUpdateSchema(
        tableSchemas.videoTable,
    ).omit({
        createdAt: true,
        updatedAt: true,
    });
    public static deleteSchema = this.baseSchema.pick({
        id: true,
    });
}

export namespace VideoDTO {
    export type Select = z.infer<typeof VideoDTO.selectSchema>;
    export type Insert = z.infer<typeof VideoDTO.insertSchema>;
    export type Update = z.infer<typeof VideoDTO.updateSchema>;
    export type Delete = z.infer<typeof VideoDTO.deleteSchema>;
}
