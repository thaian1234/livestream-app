import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod";
import { number, string, z } from "zod";

import tableSchemas, { tableRelations } from "@/server/db/schemas";

import { CategoryDTO } from "./category.dto";

const userSchema = createSelectSchema(tableSchemas.userTable, {
    email: z.string().email(),
    username: z.string().min(4).max(50),
}).omit({
    createdAt: true,
    updatedAt: true,
    hashedPassword: true,
    bio: true,
    emailVerified: true,
    id: true,
});

export class VideoDTO {
    private static baseSchema = createSelectSchema(tableSchemas.videoTable, {
        createdAt: z.date().transform((date) => date.toISOString()),
        updatedAt: z.date().transform((date) => date.toISOString()),
    });
    public static selectSchema = this.baseSchema.extend({
        likeCount: z.coerce.number().nullish(),
        dislikeCount: z.coerce.number().nullish(),
    });
    public static insertSchema = createInsertSchema(tableSchemas.videoTable);
    public static updateSchema = createUpdateSchema(
        tableSchemas.videoTable,
    ).omit({
        createdAt: true,
        updatedAt: true,
    });
    public static deleteSchema = this.baseSchema.pick({
        id: true,
    });
    public static videoWithUser = this.selectSchema.extend({
        user: userSchema,
        categories: CategoryDTO.basicSelectSchema.array(),
    });
    public cloudFlareAIErrorSchema = z.object({
        message: z.string(),
        code: z.number(),
    });
    public static cloudflareAIResponseSchema = z.object({
        result: z
            .object({
                image: z.string(),
            })
            .or(z.object({})),
        success: z.boolean(),
        errors: z.array(
            z.object({
                message: z.string(),
                code: z.number(),
            }),
        ),
        messages: z.array(z.string()),
    });
    public static videosProfileScheme = z.object({
        category: z.string(),
        video: this.selectSchema.array(),
    });
}

export namespace VideoDTO {
    export type Select = z.infer<typeof VideoDTO.selectSchema>;
    export type Insert = z.infer<typeof VideoDTO.insertSchema>;
    export type Update = z.infer<typeof VideoDTO.updateSchema>;
    export type Delete = z.infer<typeof VideoDTO.deleteSchema>;
    export type VideoWithUser = z.infer<typeof VideoDTO.videoWithUser>;
    export type CloudflareAIResponse = z.infer<
        typeof VideoDTO.cloudflareAIResponseSchema
    >;
}
