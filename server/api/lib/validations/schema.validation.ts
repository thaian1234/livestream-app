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
        hashedPassword: true,
    });
    public static insertSchema = createInsertSchema(tableSchemas.userTable, {
        email: z.string().email(),
    });
    public static updateSchema = this.baseSchema.partial().omit({
        id: true,
        email: true,
    });
    public static deleteSchema = this.baseSchema.pick({
        id: true,
    });
    public static pareBase(data: unknown) {
        return this.baseSchema.parse(data);
    }
    public static pareBaseMany(data: unknown) {
        return this.baseSchema.array().parse(data);
    }
    public static parse(data: unknown) {
        return this.selectSchema.parse(data);
    }
    public static parseMany(data: unknown) {
        return this.selectSchema.array().parse(data);
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
            password: z
                .string()
                .min(6, "Password must be at least 6 characters long")
                .max(255, "Password must not be more than 255 characters long"),
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
