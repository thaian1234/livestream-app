import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";

import tableSchemas, { tableRelations } from "@/server/db/schemas";

import { UserDTO } from "./user.dto";

export class OrderDTO {
    private static baseSchema = createSelectSchema(tableSchemas.orderTable);
    public static selectSchema = this.baseSchema.extend({
        user: UserDTO.selectSchema,
    });
    public static insertSchema = createInsertSchema(tableSchemas.orderTable);
    public static updateSchema = createUpdateSchema(
        tableSchemas.orderTable,
    ).omit({
        createdAt: true,
        updatedAt: true,
        id: true,
    });
    public static deleteSchema = this.selectSchema.pick({
        id: true,
    });

    public static paymentMethodSchema = createSelectSchema(
        tableRelations.paymentMethodEnum,
    );
}

export namespace OrderDTO {
    export type Select = z.infer<typeof OrderDTO.selectSchema>;
    export type Insert = z.infer<typeof OrderDTO.insertSchema>;
    export type Update = z.infer<typeof OrderDTO.updateSchema>;
    export type Delete = z.infer<typeof OrderDTO.deleteSchema>;
    export type PaymentMethod = z.infer<typeof OrderDTO.paymentMethodSchema>;
}
