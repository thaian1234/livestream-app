import { Fetcher } from "@/lib/helpers/fetcher";
import { client } from "@/lib/shared/client";

export const notificationApi = {
    query: {
        useGetNotificationToken(userId: string) {
            const $get = client.api.notification["notification-token"].$get;
            return Fetcher.useHonoQuery($get, ["notification-token", userId]);
        },
    },
    mutation: {},
};
