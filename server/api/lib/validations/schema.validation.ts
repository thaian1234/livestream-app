import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import tableSchemas from "@/server/db/schemas";

export class UserValidation {
    private static baseSchema = createSelectSchema(tableSchemas.userTable, {
        email: z.string().email(),
        imageUrl: z.string().url(),
        username: z.string().min(4).max(20),
    }).omit({
        createdAt: true,
        updatedAt: true,
    });
    public static selectSchema = this.baseSchema.omit({
        hasedPassword: true,
    });
    public static selectManySchema = this.selectSchema.array();
    public static insertSchema = createInsertSchema(
        tableSchemas.userTable,
    ).merge(this.baseSchema);
    public static updateSchema = this.baseSchema.partial().omit({
        id: true,
    });
    public static deleteSchema = this.baseSchema.pick({
        id: true,
    });
    public static parse(data: unknown) {
        return this.selectSchema.parse(data);
    }
    public static parseMany(data: unknown) {
        return this.selectManySchema.parse(data);
    }
}
export namespace UserValidation {
    export type Insert = z.infer<typeof UserValidation.insertSchema>;
    export type Update = z.infer<typeof UserValidation.updateSchema>;
    export type Select = z.infer<typeof UserValidation.selectSchema>;
    export type Delete = z.infer<typeof UserValidation.deleteSchema>;
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
// TODO: Add FollowTypes
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
// TODO: Add BlockTypes

export class AuthValidation {
    private static baseSchema = UserValidation.insertSchema
        .pick({
            username: true,
            email: true,
        })
        .extend({
            hasedPassword: z
                .string()
                .min(6, "Password must be at least 6 characters long"),
        });
    public static signinSchema = this.baseSchema.omit({
        username: true,
    });
    public static signupSchema = this.baseSchema;
}
export namespace AuthValidation {
    export type Signin = z.infer<typeof AuthValidation.signinSchema>;
    export type Signup = z.infer<typeof AuthValidation.signupSchema>;
}
