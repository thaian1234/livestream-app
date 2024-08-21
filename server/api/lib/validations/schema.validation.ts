import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import tableSchemas from "@/server/db/schemas";

export class UserValidation {
    private static baseSchema = createSelectSchema(tableSchemas.userTable, {
        email: z.string().email(),
        imageUrl: z.string().url(),
        username: z.string().min(4).max(20),
    });
    public static selectSchema = this.baseSchema;
    public static insertSchema = createInsertSchema(
        tableSchemas.userTable,
    ).merge(this.baseSchema);
    public static updateSchema = this.baseSchema.partial().required({
        id: true,
    });
    public static deleteSchema = this.baseSchema.pick({
        id: true,
    });
}

export class FollowValidation {
    private static baseSchema = createSelectSchema(tableSchemas.followTable);
    public static selectSchema = this.baseSchema;
    public static insertSchema = createInsertSchema(
        tableSchemas.followTable,
    ).merge(this.baseSchema);
    public static deleteSchema = this.baseSchema.pick({
        id: true,
    });
}

export class BlockValidation {
    private static baseSchema = createSelectSchema(tableSchemas.blockTable);
    public static selectSchema = this.baseSchema;
    public static insertSchema = createInsertSchema(
        tableSchemas.blockTable,
    ).merge(this.baseSchema);
    public static deleteSchema = this.baseSchema.pick({
        id: true,
    });
}

