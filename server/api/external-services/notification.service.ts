import { Utils } from "../lib/helpers/utils";
import { DefaultGenerics, NewActivity, connect } from "getstream";

import { envClient } from "@/lib/env/env.client";
import { envServer } from "@/lib/env/env.server";

export interface INotificationService
    extends Utils.AutoMappedClass<NotificationService> {}
export class NotificationService {
    private readonly notificationClient;
    constructor() {
        this.notificationClient = connect(
            envServer.GETSTREAM_PRIVATE_API_KEY,
            envClient.NEXT_PUBLIC_GETSTREAM_API_KEY,
            envClient.NEXT_PUBLIC_GETSTREAM_APP_ID,
            {
                timeout: 10000,
            },
        );
    }
    public generateUserToken(userId: string) {
        const userToken = this.notificationClient.createUserToken(userId);
        return userToken;
    }
    public async addNotificationFeed(activity: NewActivity<DefaultGenerics>) {
        const actor = this.notificationClient.feed(
            "notification",
            activity.actor,
        );

        const activityResponse = await actor.addActivity(activity);
        return activityResponse;
    }
}
