import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod";
import { number, string, z } from "zod";

import tableSchemas from "@/server/db/schemas";

const userSchema = createSelectSchema(tableSchemas.userTable, {
    email: z.string().email(),
    username: z.string().min(4).max(50),
}).omit({
    createdAt: true,
    updatedAt: true,
    hashedPassword: true,
    bio: true,
    emailVerified: true,
    email: true,
});

export class CommentDTO {
    private static baseSchema = createSelectSchema(tableSchemas.commentTable, {
        createdAt: z.date().transform((date) => date.toISOString()),
        updatedAt: z.date().transform((date) => date.toISOString()),
    });
    public static selectSchema = this.baseSchema;
    public static insertSchema = createInsertSchema(tableSchemas.commentTable);
    public static updateSchema = createUpdateSchema(
        tableSchemas.commentTable,
    ).omit({
        createdAt: true,
        updatedAt: true,
    });
    public static deleteSchema = this.baseSchema.pick({
        id: true,
    });
    public static commentWithUser = this.selectSchema.extend({
        user: userSchema,
    });
}

export namespace CommentDTO {
    export type Select = z.infer<typeof CommentDTO.selectSchema>;
    export type Insert = z.infer<typeof CommentDTO.insertSchema>;
    export type Update = z.infer<typeof CommentDTO.updateSchema>;
    export type Delete = z.infer<typeof CommentDTO.deleteSchema>;
    export type CommentWithUser = z.infer<typeof CommentDTO.commentWithUser>;
}
