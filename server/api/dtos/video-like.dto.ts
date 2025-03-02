import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod";
import { boolean, z } from "zod";

import tableSchemas from "@/server/db/schemas";

export class VideoLikeDTO {
    private static baseSchema = createSelectSchema(tableSchemas.videoLikeTable);
    public static selectSchema = this.baseSchema.omit({});
    public static insertSchema = createInsertSchema(
        tableSchemas.videoLikeTable,
    );
    public static updateSchema = createUpdateSchema(
        tableSchemas.videoLikeTable,
    );
    public static deleteSchema = this.baseSchema.pick({
        userId: true,
        videoId: true,
    });
    public static toggleSchema = this.baseSchema
        .omit({
            type: true,
        })
        .extend({
            isLike: boolean(),
        });
}

export namespace VideoLikeDTO {
    export type Select = z.infer<typeof VideoLikeDTO.selectSchema>;
    export type Insert = z.infer<typeof VideoLikeDTO.insertSchema>;
    export type Update = z.infer<typeof VideoLikeDTO.updateSchema>;
    export type Delete = z.infer<typeof VideoLikeDTO.deleteSchema>;
}
