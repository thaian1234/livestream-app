import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import tableSchemas from "@/server/db/schemas";

export class StreamDTO {
    private static baseSchema = createSelectSchema(
        tableSchemas.streamTable,
    ).omit({
        createdAt: true,
        updatedAt: true,
    });
    public static selectSchema = this.baseSchema;
    public static insertSchema = createInsertSchema(tableSchemas.streamTable);
    public static deleteSchema = this.baseSchema.pick({
        id: true,
    });
    public static updateSchema = this.baseSchema.partial().omit({
        id: true,
        userId: true,
    });
    public static parseMany(data: unknown) {
        try {
            return this.selectSchema.array().parse(data);
        } catch (error) {}
    }
    public static parse(data: unknown) {
        return this.selectSchema.parse(data);
    }
}

export namespace StreamDTO {
    export type Insert = z.infer<typeof StreamDTO.insertSchema>;
    export type Update = z.infer<typeof StreamDTO.updateSchema>;
    export type Select = z.infer<typeof StreamDTO.selectSchema>;
    export type Delete = z.infer<typeof StreamDTO.deleteSchema>;
}
