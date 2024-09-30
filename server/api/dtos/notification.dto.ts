import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import tableSchemas from "@/server/db/schemas";

export class NotificationDTO {
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
