import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import tableSchemas from "@/server/db/schemas";

export class AccountDTO {
    private static baseSchema = createSelectSchema(tableSchemas.accountTable);
    public static selectSchema = this.baseSchema;
    public static insertSchema = createInsertSchema(tableSchemas.accountTable);
    public static updateSchema = this.baseSchema.partial().required({
        providerId: true,
        providerUserId: true,
    });
    public static deleteSchema = this.baseSchema.pick({
        providerId: true,
        userId: true,
    });
    public static findOneSchema = this.baseSchema.pick({
        providerId: true,
        providerUserId: true,
        userId: true,
    });
    public static pareBase(data: unknown) {
        return this.baseSchema.parse(data);
    }
    public static parse(data: unknown) {
        return this.selectSchema.parse(data);
    }
}
export namespace AccountDTO {
    export type Insert = z.infer<typeof AccountDTO.insertSchema>;
    export type Update = z.infer<typeof AccountDTO.updateSchema>;
    export type Select = z.infer<typeof AccountDTO.selectSchema>;
    export type Delete = z.infer<typeof AccountDTO.deleteSchema>;
    export type FindOne = z.infer<typeof AccountDTO.findOneSchema>;
}
