import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import tableSchemas from "@/server/db/schemas";

export class EmailVerificationDTO {
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

export namespace EmailVerificationDTO {
    export type Insert = z.infer<typeof EmailVerificationDTO.insertSchema>;
    export type Select = z.infer<typeof EmailVerificationDTO.selectSchema>;
    export type Delete = z.infer<typeof EmailVerificationDTO.deleteSchema>;
    export type VerifyEmail = z.infer<
        typeof EmailVerificationDTO.verifyEmailSchema
    >;
}
