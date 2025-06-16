import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";

import tableSchemas from "@/server/db/schemas";

import { AccountDTO } from "./account.dto";
import { StreamDTO } from "./stream.dto";

const passwordValidation = {
    noSpaces: /(?!.*\s)/,
    validLength: /[a-zA-Z0-9@$!%*?&]{6,16}$/,
    hasNumber: /(?=.*[0-9])/,
    hasLowerCase: /(?=.*[a-z])/,
    hasUpperCase: /(?=.*[A-Z])/,
    hasSpecialChar: /(?=.*[@$!%*?&])/,
};

const usernameValidation = {
    startsWithLetter: /^[a-zA-Z]/, // Must start with letter
    validCharacters: /^[a-zA-Z0-9_]+$/, // Only letters, numbers, underscores allowed
    endsWithLetterOrNumber: /[a-zA-Z0-9]$/, // Must end with letter or number
};

export const usernameSchema = z
    .string()
    .min(4, "Must be at least 4 characters")
    .max(16, "Must be at most 16 characters")
    .regex(usernameValidation.startsWithLetter, "Must start with a letter")
    .regex(
        usernameValidation.validCharacters,
        "Can only contain letters, numbers, and underscores",
    )
    .regex(
        usernameValidation.endsWithLetterOrNumber,
        "Must end with a letter or number",
    );

const passwordSchema = z
    .string()
    .regex(passwordValidation.noSpaces, "No spaces allowed")
    .regex(passwordValidation.validLength, "Must be 6-16 characters long")
    .regex(passwordValidation.hasNumber, "At least 1 number (1-9)")
    .regex(passwordValidation.hasLowerCase, "At least 1 lowercase letter")
    .regex(passwordValidation.hasUpperCase, "At least 1 uppercase letter")
    .regex(
        passwordValidation.hasSpecialChar,
        "At least 1 special character (@$!%*?&)",
    );

export class UserDTO {
    private static baseSchema = createSelectSchema(tableSchemas.userTable, {
        email: z.string().email(),
        imageUrl: z.string().optional().nullable(),
        username: usernameSchema,
    }).omit({
        createdAt: true,
        updatedAt: true,
    });
    public static selectSchema = this.baseSchema.omit({
        hashedPassword: true,
    });
    public static insertSchema = createInsertSchema(tableSchemas.userTable, {
        username: usernameSchema,
        email: z.string().email(),
    });
    public static updateSchema = createUpdateSchema(tableSchemas.userTable);
    public static deleteSchema = this.baseSchema.pick({
        id: true,
    });
    public static updatePasswordSchema = z
        .object({
            currentPassword: passwordSchema,
            newPassword: passwordSchema,
            confirmPassword: passwordSchema,
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
            message: "Confirm password must match new password",
            path: ["confirmPassword"],
        });
    public static userWithAccountsAndStreamSchema = this.selectSchema.extend({
        accounts: AccountDTO.selectSchema.array(),
        stream: StreamDTO.selectSchema,
        wallet: z
            .object({
                id: z.string(),
                balance: z.number(),
            })
            .nullable(),
    });
    public static selectUserSearch = this.selectSchema
        .extend({
            followerCount: z.number(),
            isLive: z.boolean(),
            isFollow: z.boolean(),
        })
        .omit({
            email: true,
            emailVerified: true,
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
    public static parseManySearch(data: unknown) {
        return this.selectUserSearch.array().parse(data);
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
