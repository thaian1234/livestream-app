import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";

import tableSchemas, { tableRelations } from "@/server/db/schemas";

export class WalletTransactionDTO {
    private static baseSchema = createSelectSchema(
        tableSchemas.walletTransactionTable,
    );
    public static selectSchema = this.baseSchema;
    public static insertSchema = createInsertSchema(
        tableSchemas.walletTransactionTable,
    );
    public static updateSchema = createUpdateSchema(
        tableSchemas.walletTransactionTable,
    ).omit({
        createdAt: true,
    });
    public static deleteSchema = this.selectSchema.pick({
        id: true,
    });
    public static transactionTypeEnum = createSelectSchema(
        tableRelations.transactionTypeEnum,
    );
    public static addFundsSchema = this.insertSchema.omit({
        id: true,
        walletId: true,
        amount: true,
        balanceBefore: true,
        balanceAfter: true,
        createdAt: true,
    });
    public static detuctFundsSchema = this.addFundsSchema;
}

export namespace WalletTransactionDTO {
    export type Select = z.infer<typeof WalletTransactionDTO.selectSchema>;
    export type Insert = z.infer<typeof WalletTransactionDTO.insertSchema>;
    export type Update = z.infer<typeof WalletTransactionDTO.updateSchema>;
    export type Delete = z.infer<typeof WalletTransactionDTO.deleteSchema>;
    export type TransactionTypeEnum = z.infer<
        typeof WalletTransactionDTO.transactionTypeEnum
    >;
    export type AddFunds = z.infer<typeof WalletTransactionDTO.addFundsSchema>;
    export type DetuctFunds = z.infer<
        typeof WalletTransactionDTO.detuctFundsSchema
    >;
}
