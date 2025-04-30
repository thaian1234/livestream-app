import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";

import tableSchemas from "@/server/db/schemas";

export class DonateCardDTO {
    private static baseSchema = createSelectSchema(
        tableSchemas.donateCardTable,
    );
    public static selectSchema = this.baseSchema;
    public static insertSchema = createInsertSchema(
        tableSchemas.donateCardTable,
    ).omit({
        createdAt: true,
        updatedAt: true,
    });
    public static updateSchema = createUpdateSchema(
        tableSchemas.donateCardTable,
    ).omit({
        createdAt: true,
        updatedAt: true,
        id: true,
    });
    public static deleteSchema = this.selectSchema.pick({
        id: true,
    });
}

export namespace DonateCardDTO {
    export type Select = z.infer<typeof DonateCardDTO.selectSchema>;
    export type Insert = z.infer<typeof DonateCardDTO.insertSchema>;
    export type Update = z.infer<typeof DonateCardDTO.updateSchema>;
    export type Delete = z.infer<typeof DonateCardDTO.deleteSchema>;
}
