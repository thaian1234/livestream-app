import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";

import tableSchemas from "@/server/db/schemas";

export class WalletDTO {
    private static baseSchema = createSelectSchema(tableSchemas.walletTable);
    public static selectSchema = this.baseSchema;
    public static insertSchema = createInsertSchema(tableSchemas.walletTable);
    public static updateSchema = createUpdateSchema(
        tableSchemas.walletTable,
    ).omit({
        createdAt: true,
        updatedAt: true,
    });
    public static deleteSchema = this.selectSchema.pick({
        id: true,
    });
}

export namespace WalletDTO {
    export type Select = z.infer<typeof WalletDTO.selectSchema>;
    export type Insert = z.infer<typeof WalletDTO.insertSchema>;
    export type Update = z.infer<typeof WalletDTO.updateSchema>;
    export type Delete = z.infer<typeof WalletDTO.deleteSchema>;
}
