import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import tableSchemas from "@/server/db/schemas";

import { UserDTO } from "./user.dto";

export class BlockDTO {
    private static baseSchema = createSelectSchema(tableSchemas.blockTable);
    public static selectSchema = this.baseSchema
        .extend({
            blocked: UserDTO.selectSchema.omit({ bio: true }),
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
    public static selectUserOnlySchema = UserDTO.selectSchema
        .omit({
            bio: true,
        })
        .extend({
            createdAt: z.date(),
        });
    public static parseUserOnlyMany(data: unknown) {
        try {
            return this.selectUserOnlySchema.array().parse(data);
        } catch (error) {
            return undefined;
        }
    }
}

export namespace BlockDTO {
    export type Insert = z.infer<typeof BlockDTO.insertSchema>;
    export type Select = z.infer<typeof BlockDTO.selectSchema>;
    export type Delete = z.infer<typeof BlockDTO.deleteSchema>;
}
