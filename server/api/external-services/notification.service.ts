import { DefaultGenerics, NewActivity, connect } from "getstream";

import { envClient } from "@/lib/env/env.client";
import { envServer } from "@/lib/env/env.server";

import { Utils } from "../lib/helpers/utils";

import { OrderDTO } from "../dtos/order.dto";

export const NotificationTypes = {
    STREAM_START: "stream_start",
    STREAM_END: "stream_end",
    NEW_FOLLOWER: "new_follower",
    UNFOLLOW: "unfollow",
    BLOCKED: "blocked",
    UN_BLOCKED: "un_blocked",
    DONATION_RECEIVED: "donation_received",
} as const;

type NotificationType = keyof typeof NotificationTypes;

interface NotificationParams {
    type: NotificationType;
    actorId: string;
    targetId: string;
    actorName: string;
    actorAvatar: string | null;
    extraData?: Record<string, any>;
}

interface StreamNotificationParams {
    streamerId: string;
    streamerName: string;
    streamerAvatar: string | null;
    followerIds: string[];
}

interface StreamDonationNotificationParams {
    donorId: string;
    donorName: string;
    donorAvatar: string | null;
    streamerId: string;
    order: OrderDTO.Select;
}

export interface INotificationService
    extends Utils.AutoMappedClass<NotificationService> {}

export class NotificationService implements INotificationService {
    private readonly notificationClient;

    constructor() {
        this.notificationClient = connect(
            envClient.NEXT_PUBLIC_GETSTREAM_API_KEY,
            envServer.GETSTREAM_PRIVATE_API_KEY,
            envClient.NEXT_PUBLIC_GETSTREAM_APP_ID,
            { timeout: 10000, location: "singapore" },
        );
    }

    public generateUserToken(userId: string) {
        return this.notificationClient.createUserToken(userId);
    }

    private async createBaseNotification(params: NotificationParams) {
        const {
            type,
            actorId,
            targetId,
            actorName,
            actorAvatar,
            extraData = {},
        } = params;
        const targetFeed = this.notificationClient.feed(
            "notifications",
            targetId,
        );

        const activity: NewActivity<DefaultGenerics> = {
            actor: actorId,
            verb: type,
            object: targetId,
            time: new Date().toISOString(),
            foreign_id: `${type}:${actorId}-${targetId}`,
            target: targetId,
            type,
            actorName,
            actorAvatar,
            ...extraData,
        };

        return targetFeed.addActivity(activity);
    }

    public async createFollowNotification(
        params: Omit<NotificationParams, "type">,
    ) {
        return this.createBaseNotification({ ...params, type: "NEW_FOLLOWER" });
    }

    public async createUnfollowNotification(
        params: Omit<NotificationParams, "type">,
    ) {
        return this.createBaseNotification({ ...params, type: "UNFOLLOW" });
    }

    public async createStreamStartNotification(
        params: StreamNotificationParams,
    ) {
        const { streamerId, streamerName, followerIds, streamerAvatar } =
            params;
        const targetFeed = this.notificationClient.feed(
            "notifications",
            streamerId,
        );

        const activity: NewActivity<DefaultGenerics> = {
            actor: streamerId,
            verb: "STREAM_START",
            object: streamerId,
            time: new Date().toISOString(),
            foreign_id: `STREAM_START:${streamerId}`,
            target: streamerId,
            type: "STREAM_START",
            actorName: streamerName,
            to: followerIds.map((id) => `notifications:${id}`),
            actorAvatar: streamerAvatar,
        };

        return targetFeed.addActivity(activity);
    }
    public async createStreamDonationNotification(
        params: Omit<NotificationParams, "type">,
    ) {
        return this.createBaseNotification({
            ...params,
            type: "DONATION_RECEIVED",
        });
    }
}
