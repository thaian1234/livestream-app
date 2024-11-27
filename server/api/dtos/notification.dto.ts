import { z } from "zod";

export class NotificationDTO {
    static activitySchema = z.object({
        actor: z.string(),
        actorName: z.string().optional(),
        actorAvatar: z.string().nullable().optional(),
        foreign_id: z.string(),
        id: z.string(),
        object: z.string(),
        origin: z.any(),
        target: z.string(),
        time: z.string(),
        type: z.string(),
        verb: z.string(),
    });
    static resultSchema = z.object({
        activities: z.array(this.activitySchema),
        activity_count: z.number(),
        actor_count: z.number(),
        created_at: z.string(),
        group: z.string(),
        id: z.string(),
        is_read: z.boolean(),
        is_seen: z.boolean(),
        updated_at: z.string(),
        verb: z.string(),
    });
    static feedResponseSchema = z.object({
        results: z.array(this.resultSchema),
        next: z.string(),
        duration: z.string(),
        unseen: z.number(),
        unread: z.number(),
    });
}

export namespace NotificationDTO {
    export type FeedResponse = z.infer<
        typeof NotificationDTO.feedResponseSchema
    >;
    export type Activity = z.infer<typeof NotificationDTO.activitySchema>;
    export type Result = z.infer<typeof NotificationDTO.resultSchema>;
}
