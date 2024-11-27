import { notificationApi } from "../features/notification/apis";
import { DefaultGenerics, RealTimeMessage, connect } from "getstream";
import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { envClient } from "@/lib/env/env.client";

import { NotificationDTO } from "@/server/api/dtos/notification.dto";

interface NotificationContextType {
    notifications: NotificationDTO.Activity[];
    notificationFeed?: NotificationDTO.FeedResponse;
    results: NotificationDTO.Result[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(
    undefined,
);

export function NotificationProvider({
    children,
    userId,
}: {
    children: ReactNode;
    userId: string;
}) {
    const { data } = notificationApi.query.useGetNotificationToken(userId);
    const [notifications, setNotifications] = useState<
        NotificationDTO.Activity[]
    >([]);
    const [notificationFeed, setnotificationFeed] = useState<
        NotificationDTO.FeedResponse | undefined
    >();
    const [results, setResult] = useState<NotificationDTO.Result[]>([]);

    useEffect(() => {
        if (!data) return;

        const client = connect(
            envClient.NEXT_PUBLIC_GETSTREAM_API_KEY,
            data.data.token,
            envClient.NEXT_PUBLIC_GETSTREAM_APP_ID,
            { timeout: 10000, location: "singapore" },
        );

        const notificationFeed = client.feed("notifications", userId);

        const handleNotification = (data: RealTimeMessage<DefaultGenerics>) => {
            if (data.new?.length > 0) {
                const newActivity = NotificationDTO.activitySchema
                    .array()
                    .parse(data.new);
                setNotifications((prev) => {
                    const uniqueActivities = [...newActivity, ...prev].filter(
                        (activity, index, self) =>
                            index ===
                            self.findIndex((a) => a.id === activity.id),
                    );
                    return uniqueActivities;
                });
                console.log("New notification:", newActivity);
            }
        };

        const successCallback = () => {
            console.log("Successfully connected to notification feed");
        };

        const failCallback = (error: unknown) => {
            console.error("Failed to connect to notification feed:", error);
            setTimeout(() => {
                notificationFeed
                    .subscribe(handleNotification)
                    .then(successCallback, failCallback);
            }, 5000);
        };

        notificationFeed
            .subscribe(handleNotification)
            .then(successCallback, failCallback);

        notificationFeed.get({ limit: 2 }).then((response) => {
            try {
                const validatedNotificationsResponse =
                    NotificationDTO.feedResponseSchema.parse(response);
                setnotificationFeed(validatedNotificationsResponse);
                setResult(validatedNotificationsResponse.results);
                validatedNotificationsResponse.results.forEach((result) => {
                    setNotifications((prev) => {
                        const uniqueActivities = [...result.activities, ...prev]
                            .filter(
                                (activity, index, self) =>
                                    index ===
                                    self.findIndex((a) => a.id === activity.id),
                            )
                            .sort((a, b) => {
                                if (a.time && b.time) {
                                    return (
                                        new Date(b.time).getTime() -
                                        new Date(a.time).getTime()
                                    );
                                }
                                return 0;
                            });
                        return uniqueActivities;
                    });
                });
            } catch (error) {
                console.error(error);
            }
        });

        return () => {
            notificationFeed.unsubscribe();
        };
    }, [data, userId]);
    return (
        <NotificationContext.Provider
            value={{ notifications, notificationFeed, results }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error(
            "useNotification must be used within NotificationProvider",
        );
    }
    return context;
}
