import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";

import tableSchemas from "@/server/db/schemas";

export class EventDTO {
    private static baseSchema = createSelectSchema(tableSchemas.eventTable);
    public static selectSchema = this.baseSchema;
    public static insertSchema = createInsertSchema(tableSchemas.eventTable);
    public static deleteSchema = this.baseSchema.pick({
        id: true,
        userId: true,
    });
    public static updateSchema = createUpdateSchema(tableSchemas.eventTable);
}

export namespace EventDTO {
    export type Insert = z.infer<typeof EventDTO.insertSchema>;
    export type Update = z.infer<typeof EventDTO.updateSchema>;
    export type Delete = z.infer<typeof EventDTO.deleteSchema>;
    export type Select = z.infer<typeof EventDTO.selectSchema>;
}
