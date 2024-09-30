import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import tableSchemas from "@/server/db/schemas";

import { UserDTO } from "./user.dto";

export class FollowDTO {
    private static baseSchema = createSelectSchema(tableSchemas.followTable);
    public static selectSchema = this.baseSchema;
    public static insertSchema = createInsertSchema(tableSchemas.followTable);
    public static deleteSchema = this.baseSchema.pick({
        followedId: true,
        followerId: true,
    });
    public static selectUserOnlySchema = UserDTO.selectSchema.omit({
        bio: true,
    });
    public static parseUserOnlyMany(data: unknown) {
        try {
            return this.selectUserOnlySchema.array().parse(data);
        } catch (error) {
            return undefined;
        }
    }
}
export namespace FollowDTO {
    export type Insert = z.infer<typeof FollowDTO.insertSchema>;
    export type Select = z.infer<typeof FollowDTO.selectSchema>;
    export type Delete = z.infer<typeof FollowDTO.deleteSchema>;
}
