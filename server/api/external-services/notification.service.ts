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
            ...extraData,
        };
        const activityResponse = await targetFeed.addActivity(activity);
        return activityResponse;
    }

    public async createFollowNotification(
        followerId: string,
        followedId: string,
        actorName: string,
    ) {
        return this.createNotification(
            "NEW_FOLLOWER",
            followerId,
            followedId,
            actorName,
        );
    }
    public async createUnfollowNotification(
        unfollowerId: string,
        unfollowedId: string,
        actorName: string,
    ) {
        return this.createNotification(
            "UNFOLLOW",
            unfollowerId,
            unfollowedId,
            actorName,
        );
    }

    // public async createStreamStartNotification(streamerId: string) {
    //     return this.createNotification("STREAM_START", streamerId, streamerId, {
    //         streamTitle: "Started streaming",
    //     });
    // }

    // public async createStreamEndNotification(streamerId: string) {
    //     return this.createNotification("STREAM_END", streamerId, streamerId);
    // }

    public async createBlockNotification(
        blockerId: string,
        blockedId: string,
        actorName: string,
    ) {
        return this.createNotification(
            "BLOCKED",
            blockerId,
            blockedId,
            actorName,
        );
    }
}
