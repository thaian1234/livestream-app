import { UserDTO } from "../dtos/user.dto";
import { Utils } from "../lib/helpers/utils";
import { DefaultGenerics, NewActivity, connect } from "getstream";

import { envClient } from "@/lib/env/env.client";
import { envServer } from "@/lib/env/env.server";

export const NotificationEnum = {
    STREAM_START: "stream_start",
    STREAM_END: "stream_end",
    NEW_FOLLOWER: "new_follower",
    UNFOLLOW: "unfollow",
    BLOCKED: "blocked",
    UN_BLOCKED: "un_blocked",
} as const;

export interface INotificationService
    extends Utils.AutoMappedClass<NotificationService> {}
export class NotificationService {
    private readonly notificationClient;
    constructor() {
        this.notificationClient = connect(
            envClient.NEXT_PUBLIC_GETSTREAM_API_KEY,
            envServer.GETSTREAM_PRIVATE_API_KEY,
            envClient.NEXT_PUBLIC_GETSTREAM_APP_ID,
            {
                timeout: 10000,
                location: "singapore",
            },
        );
    }
    public generateUserToken(userId: string) {
        const userToken = this.notificationClient.createUserToken(userId);
        return userToken;
    }

    public async createNotification(
        type: keyof typeof NotificationEnum,
        actorId: string,
        targetId: string,
        actorName: string,
        actorAvatar: string | null,
        extraData = {},
    ) {
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
        const activityResponse = await targetFeed.addActivity(activity);
        return activityResponse;
    }

    public async createFollowNotification(
        followerId: string,
        followedId: string,
        actorName: string,
        actorAvatar: string | null,
    ) {
        return this.createNotification(
            "NEW_FOLLOWER",
            followerId,
            followedId,
            actorName,
            actorAvatar,
        );
    }
    public async createUnfollowNotification(
        unfollowerId: string,
        unfollowedId: string,
        actorName: string,
        actorAvatar: string | null,
    ) {
        return this.createNotification(
            "UNFOLLOW",
            unfollowerId,
            unfollowedId,
            actorName,
            actorAvatar,
        );
    }

    public async createStreamStartNotification(
        streamerId: string,
        streamerName: string,
        streamTitle: string,
        followerIds: string[],
    ) {
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
            streamTitle,
            to: followerIds.map((id) => `notifications:${id}`),
        };

        return targetFeed.addActivity(activity);
    }

    // public async createStreamEndNotification(streamerId: string) {
    //     return this.createNotification("STREAM_END", streamerId, streamerId);
    // }

    public async createBlockNotification(
        blockerId: string,
        blockedId: string,
        actorName: string,
        actorAvatar: string | null,
    ) {
        return this.createNotification(
            "BLOCKED",
            blockerId,
            blockedId,
            actorName,
            actorAvatar,
        );
    }
    public async createUnblockNotification(
        unblockerId: string,
        unblockedId: string,
        actorName: string,
        actorAvatar: string | null,
    ) {
        return this.createNotification(
            "UN_BLOCKED",
            unblockerId,
            unblockedId,
            actorName,
            actorAvatar,
        );
    }
}
