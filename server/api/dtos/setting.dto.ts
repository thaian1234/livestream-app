import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import tableSchemas from "@/server/db/schemas";

export class SettingDTO {
    private static baseSchema = createSelectSchema(
        tableSchemas.settingTable,
        {},
    );
    public static selectSchema = this.baseSchema;
    public static insertSchema = createInsertSchema(tableSchemas.settingTable);
    public static updateSchema = this.baseSchema.partial().omit({
        id: true,
        streamId: true,
    });
    public static deleteSchema = this.baseSchema.pick({
        streamId: true,
    });
}

export namespace SettingDTO {
    export type Insert = z.infer<typeof SettingDTO.insertSchema>;
    export type Update = z.infer<typeof SettingDTO.updateSchema>;
    export type Select = z.infer<typeof SettingDTO.selectSchema>;
    export type Delete = z.infer<typeof SettingDTO.deleteSchema>;
}
