import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import tableSchemas from "@/server/db/schemas";

import { AccountDTO } from "./account.dto";
import { StreamDTO } from "./stream.dto";

export class UserDTO {
    private static baseSchema = createSelectSchema(tableSchemas.userTable, {
        email: z.string().email(),
        imageUrl: z.string().url(),
        username: z.string().min(4).max(50),
    }).omit({
        createdAt: true,
        updatedAt: true,
    });
    public static selectSchema = this.baseSchema.omit({
        hashedPassword: true,
    });
    public static insertSchema = createInsertSchema(tableSchemas.userTable, {
        username: z.string().min(4).max(50),
        email: z.string().email(),
    });
    public static updateSchema = this.baseSchema.partial().omit({
        id: true,
        email: true,
    });
    public static deleteSchema = this.baseSchema.pick({
        id: true,
    });
    public static updatePasswordSchema = z
        .object({
            currentPassword: z
                .string()
                .min(6, "Password must be at least 6 characters long")
                .max(255, "Password must not be more than 255 characters long"),
            newPassword: z
                .string()
                .min(6, "Password must be at least 6 characters long")
                .max(255, "Password must not be more than 255 characters long"),
            confirmPassword: z
                .string()
                .min(6, "Password must be at least 6 characters long")
                .max(255, "Password must not be more than 255 characters long"),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
            message: "Confirm password must match new password",
            path: ["confirmPassword"],
        });
    public static userWithAccountsAndStreamSchema = this.selectSchema.extend({
        accounts: AccountDTO.selectSchema.array(),
        stream: StreamDTO.selectSchema,
    });
    public static selectUserWithNumberOfFollower = this.selectSchema.extend({
        followerCount: z.number(),
        isLive: z.boolean()
    })
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
    public static parseManySearch(data: unknown) {
        return this.selectUserWithNumberOfFollower.array().parse(data);
    }
}
export namespace UserDTO {
    export type Insert = z.infer<typeof UserDTO.insertSchema>;
    export type Update = z.infer<typeof UserDTO.updateSchema>;
    export type Select = z.infer<typeof UserDTO.selectSchema>;
    export type Delete = z.infer<typeof UserDTO.deleteSchema>;
    export type UpdatePassword = z.infer<typeof UserDTO.updatePasswordSchema>;
    export type UserWithAccountsAndStream = z.infer<
        typeof UserDTO.userWithAccountsAndStreamSchema
    >;
}
