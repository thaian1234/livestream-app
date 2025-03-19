import { Fetcher } from "@/lib/helpers/fetcher";
import { baseClient } from "@/lib/shared/client";

import { NotificationRouteType } from "@/server/api/routes/notification.routes";

const baseApi = baseClient<NotificationRouteType>().notification;

export const notificationApi = {
    query: {
        useGetNotificationToken(userId: string) {
            const $get = baseApi["notification-token"].$get;
            return Fetcher.useHonoQuery($get, ["notification-token", userId]);
        },
    },
    mutation: {},
};
