import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import tableSchemas from "@/server/db/schemas";

export class StreamDTO {
    private static baseSchema = createSelectSchema(tableSchemas.streamTable);
    public static selectSchema = this.baseSchema;
    public static insertSchema = createInsertSchema(tableSchemas.streamTable);
    public static deleteSchema = this.baseSchema.pick({
        id: true,
    });
    public static parseMany(data: unknown) {
        return this.selectSchema.array().parse(data);
    }
}
