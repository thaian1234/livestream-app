import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import tableSchemas from "@/server/db/schemas";

export class UserValidation {
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
    public static insertSchema = createInsertSchema(tableSchemas.followTable);
    public static deleteSchema = this.baseSchema.pick({
        followedId: true,
        followerId: true,
    });
    public static selectUserOnlySchema = UserValidation.selectSchema.omit({
        bio: true,
    });
    public static parseUserOnlyMany(data: unknown) {
        return this.selectUserOnlySchema.array().parse(data);
    }
}
export namespace FollowValidation {
    export type Insert = z.infer<typeof FollowValidation.insertSchema>;
    export type Select = z.infer<typeof FollowValidation.selectSchema>;
    export type Delete = z.infer<typeof FollowValidation.deleteSchema>;
}
// TODO: Add FollowTypes
export class BlockValidation {
    private static baseSchema = createSelectSchema(tableSchemas.blockTable);
    public static selectSchema = this.baseSchema
        .extend({
            blocked: UserValidation.selectSchema.omit({ bio: true }),
        })
        .omit({
            blockedId: true,
            blockerId: true,
        });
    public static insertSchema = createInsertSchema(tableSchemas.blockTable);
    public static deleteSchema = this.baseSchema.pick({
        blockedId: true,
        blockerId: true,
    });
    public static parseMany(data: unknown) {
        return this.selectSchema.array().parse(data);
    }
}

export namespace BlockValidation {
    export type Insert = z.infer<typeof BlockValidation.insertSchema>;
    export type Select = z.infer<typeof BlockValidation.selectSchema>;
    export type Delete = z.infer<typeof BlockValidation.deleteSchema>;
}

export class StreamValidation {
    private static baseSchema = createSelectSchema(tableSchemas.streamTable);
    public static selectSchema = this.baseSchema;
    public static insertSchema = createInsertSchema(tableSchemas.streamTable);
    public static deleteSchema = this.baseSchema.pick({
        id: true,
    });
    public static parseMany(data: unknown) {
        return this.selectSchema.array().parse(data);
    }
}

export class NotificationValidation {
    private static baseSchema = createSelectSchema(
        tableSchemas.notificationTable,
    );
    public static selectSchema = this.baseSchema;
    public static insertSchema = createInsertSchema(
        tableSchemas.notificationTable,
    );
    public static deleteSchema = this.baseSchema.pick({
        id: true,
    });
}

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
            confirmPassword: z
                .string()
                .min(6, "Password must be at least 6 characters long"),
        });
    public static signinSchema = this.baseSchema.omit({
        username: true,
        confirmPassword: true,
    });
    public static signupSchema = this.baseSchema.refine(
        (data) => data.password === data.confirmPassword,
        {
            path: ["confirmPassword"], // Đây là trường bị lỗi khi validation không thành công
            message: "Passwords must match",
        },
    );
}
export namespace AuthValidation {
    export type Signin = z.infer<typeof AuthValidation.signinSchema>;
    export type Signup = z.infer<typeof AuthValidation.signupSchema>;
}

export class EmailVerificationValidation {
    private static baseSchema = createSelectSchema(
        tableSchemas.emailVerificationTable,
        {
            code: z
                .string()
                .length(8, "Verify Code must be 8 characters long")
                .regex(/^\d+$/, "Verify Code must only contain numbers"),
        },
    );
    public static selectSchema = this.baseSchema;
    public static insertSchema = createInsertSchema(
        tableSchemas.emailVerificationTable,
        {
            code: z
                .string()
                .length(8, "Verify Code must be 8 characters long")
                .regex(/^\d+$/, "Verify Code must only contain numbers"),
        },
    );
    public static deleteSchema = this.baseSchema.pick({
        id: true,
    });
    public static verifyEmailSchema = this.baseSchema.pick({
        code: true,
        userId: true,
    });
}

export namespace EmailVerificationValidation {
    export type Insert = z.infer<
        typeof EmailVerificationValidation.insertSchema
    >;
    export type Select = z.infer<
        typeof EmailVerificationValidation.selectSchema
    >;
    export type Delete = z.infer<
        typeof EmailVerificationValidation.deleteSchema
    >;
    export type VerifyEmail = z.infer<
        typeof EmailVerificationValidation.verifyEmailSchema
    >;
}

export class AccountValidation {
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
export namespace AccountValidation {
    export type Insert = z.infer<typeof AccountValidation.insertSchema>;
    export type Update = z.infer<typeof AccountValidation.updateSchema>;
    export type Select = z.infer<typeof AccountValidation.selectSchema>;
    export type Delete = z.infer<typeof AccountValidation.deleteSchema>;
    export type FindOne = z.infer<typeof AccountValidation.findOneSchema>;
}

export class GoogleValidation {
    private static baseSchema = z.object({
        id: z.string(),
        email: z.string().email(),
        name: z.string(),
        picture: z.string().url(),
        verified_email: z.boolean().default(false),
    });
    public static responseSchema = this.baseSchema;
}

export namespace GoogleValidation {
    export type Response = z.infer<typeof GoogleValidation.responseSchema>;
}

export class GitHubValidation {
    private static baseSchema = z.object({
        id: z.number().transform((num) => num.toString()),
        email: z.string().email(),
        name: z.string(),
        avatar_url: z.string().url(),
        verified_email: z.boolean().default(true),
    });
    public static responseSchema = this.baseSchema;
}

export namespace GitHubValidation {
    export type Response = z.infer<typeof GitHubValidation.responseSchema>;
}

export class R2BucketValidation {
    private static allowedFileTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
    ] as const;
    public static uploadFileSchema = z.object({
        fileName: z.string().min(1),
        fileSize: z.coerce.number(),
        fileType: z
            .string()
            .refine((type) => this.allowedFileTypes.includes(type as any), {
                message:
                    "Invalid file type. Allowed types are: jpeg, png, gif, webp",
            }),
    });
}
export namespace R2BucketValidation {
    export type UploadFile = z.infer<
        typeof R2BucketValidation.uploadFileSchema
    >;
}

export class QueryValidation {
    private static createBaseSchema(defaultPage: number, defaultSize: number) {
        return z.object({
            page: z.preprocess(
                (x) => (x ? x : undefined),
                z.coerce.number().int().min(1).default(defaultPage),
            ),
            size: z.preprocess(
                (x) => (x ? x : undefined),
                z.coerce.number().int().min(0).default(defaultSize),
            ),
        });
    }

    public static createPaginationSchema(defaultPage = 1, defaultSize = 10) {
        return this.createBaseSchema(defaultPage, defaultSize);
    }

    public static createFilterSchema(defaultPage = 1, defaultSize = 10) {
        return this.createBaseSchema(defaultPage, defaultSize).extend({
            filterBy: z.string().optional(),
        });
    }

    public static createAdvancedSchema(defaultPage = 1, defaultSize = 10) {
        return this.createFilterSchema(defaultPage, defaultSize).extend({
            dateFrom: z.preprocess((x) => {
                if (typeof x === "string" || x instanceof Date) {
                    const parsedDate = new Date(x);
                    return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
                }
                return undefined;
            }, z.date().optional()),
            dateTo: z.preprocess((x) => {
                if (typeof x === "string" || x instanceof Date) {
                    const parsedDate = new Date(x);
                    return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
                }
                return undefined;
            }, z.date().optional()),
            isSortByCreatedAt: z.preprocess(
                (x) => (x ? x : undefined),
                z.coerce.boolean(),
            ),
            sortOrder: z.string().optional(),
        });
    }
}
