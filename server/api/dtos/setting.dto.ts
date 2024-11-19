import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import tableSchemas from "@/server/db/schemas";

export class SettingDTO {
    private static baseSchema = createSelectSchema(
        tableSchemas.settingTable,
        {},
    );
    public static selectSchema = this.baseSchema.omit({
        streamKey: true,
        serverUrl: true,
        createdAt: true,
        updatedAt: true,
    });
    public static insertSchema = createInsertSchema(tableSchemas.settingTable);
    public static updateSchema = this.baseSchema.partial().omit({
        streamId: true,
    });

    public static updateKeySchema = this.baseSchema
        .pick({
            serverUrl: true,
            streamKey: true,
        })
        .extend({
            serverUrl: z.string().min(1),
            streamKey: z.string().min(1),
        });
    public static updateInformationSchema = this.baseSchema.partial().omit({
        streamId: true,
        streamKey: true,
        serverUrl: true,
        id: true,
    });
    public static deleteSchema = this.baseSchema.pick({
        streamId: true,
    });
}

export namespace SettingDTO {
    export type Insert = z.infer<typeof SettingDTO.insertSchema>;
    export type Update = z.infer<typeof SettingDTO.updateSchema>;
    export type UpdateKey = z.infer<typeof SettingDTO.updateKeySchema>;
    export type UpdateInformation = z.infer<
        typeof SettingDTO.updateInformationSchema
    >;
    export type Select = z.infer<typeof SettingDTO.selectSchema>;
    export type Delete = z.infer<typeof SettingDTO.deleteSchema>;
}
