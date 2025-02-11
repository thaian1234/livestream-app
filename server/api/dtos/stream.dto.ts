import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import tableSchemas from "@/server/db/schemas";

import { CategoryDTO } from "./category.dto";
import { SettingDTO } from "./setting.dto";

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

export class StreamDTO {
    private static baseSchema = createSelectSchema(
        tableSchemas.streamTable,
    ).omit({
        createdAt: true,
        updatedAt: true,
    });
    public static selectSchema = this.baseSchema;
    public static insertSchema = createInsertSchema(tableSchemas.streamTable);
    public static deleteSchema = this.baseSchema.pick({
        id: true,
    });
    public static updateSchema = this.baseSchema.partial().omit({
        id: true,
        userId: true,
    });
    public static streamWithUser = this.selectSchema.extend({
        user: userSchema,
        categories: CategoryDTO.basicSelectSchema.array(),
    });
    public static streamSearch = this.selectSchema.extend({
        username: z.string(),
        avatar: z.string().nullish(),
        categories: CategoryDTO.basicSelectSchema.array(),
    });
    public static streamWithSetting = this.selectSchema.extend({
        setting: SettingDTO.selectSchema.nullable(),
    });
    public static parseManySearch(data: unknown) {
        return this.streamSearch.array().parse(data);
    }
    public static parseMany(data: unknown) {
        try {
            return this.selectSchema.array().parse(data);
        } catch (error) {}
    }
    public static parseStreamWithUser(data: unknown) {
        try {
            return this.streamWithUser.array().parse(data);
        } catch (error) {
            console.error(error);
        }
    }
    public static parse(data: unknown) {
        return this.selectSchema.parse(data);
    }
}

export namespace StreamDTO {
    export type Insert = z.infer<typeof StreamDTO.insertSchema>;
    export type Update = z.infer<typeof StreamDTO.updateSchema>;
    export type Select = z.infer<typeof StreamDTO.selectSchema>;
    export type StreamWithUser = z.infer<typeof StreamDTO.streamWithUser>;
    export type StreamWithSetting = z.infer<typeof StreamDTO.streamWithSetting>;
    export type Delete = z.infer<typeof StreamDTO.deleteSchema>;
}
