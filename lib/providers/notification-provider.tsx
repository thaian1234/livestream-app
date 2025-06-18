import { DefaultGenerics, RealTimeMessage, connect } from "getstream";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { toast } from "sonner";

import { envClient } from "@/lib/env/env.client";

import { NotificationDTO } from "@/server/api/dtos/notification.dto";

import DonationNotification from "@/components/donation-notification";
import StreamNotification from "@/components/stream-notification";

import { notificationApi } from "../features/notification/apis";
import { useAuth } from "./auth-provider";

interface NotificationContextType {
    notifications: NotificationDTO.Activity[];
    notificationFeed?: NotificationDTO.FeedResponse;
    results: NotificationDTO.Result[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(
    undefined,
);

type ParamsType = {
    username: string;
};

export function NotificationProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const { data } = notificationApi.query.useGetNotificationToken(
        user?.id || "",
    );
    const [notifications, setNotifications] = useState<
        NotificationDTO.Activity[]
    >([]);
    const [notificationFeed, setnotificationFeed] = useState<
        NotificationDTO.FeedResponse | undefined
    >();
    const [results, setResult] = useState<NotificationDTO.Result[]>([]);
    const pathname = usePathname();
    const router = useRouter();
    const params = useParams<ParamsType>();

    useEffect(() => {
        if (!data || !user?.id) return;

        const client = connect(
            envClient.NEXT_PUBLIC_GETSTREAM_API_KEY,
            data.data.token,
            envClient.NEXT_PUBLIC_GETSTREAM_APP_ID,
            { timeout: 10000, location: "singapore" },
        );

        const notificationFeed = client.feed("notifications", user.id);

        const handleNotification = (data: RealTimeMessage<DefaultGenerics>) => {
            if (data.new?.length > 0) {
                const newActivity = NotificationDTO.activitySchema
                    .array()
                    .parse(data.new)
                    .filter((activity) => activity.actor !== user.id);

                setNotifications((prev) => {
                    const uniqueActivities = [...newActivity, ...prev].filter(
                        (activity, index, self) =>
                            index ===
                            self.findIndex((a) => a.id === activity.id),
                    );
                    return uniqueActivities;
                });
                const latestActivity = newActivity.sort((a, b) => {
                    if (a.time && b.time) {
                        return (
                            new Date(b.time).getTime() -
                            new Date(a.time).getTime()
                        );
                    }
                    return 0;
                })[0];
                if (latestActivity) {
                    handleNotificationEvent(latestActivity);
                }
            }
        };
        const handleNotificationEvent = (
            latestActivity: NotificationDTO.Activity,
        ) => {
            switch (latestActivity.type) {
                case "BLOCKED":
                    if (
                        isUsernamePage() &&
                        params?.username === latestActivity.actorName
                    ) {
                        router.replace("/");
                    }
                    break;
                case "STREAM_START":
                    toast.custom(() => (
                        <StreamNotification
                            streamerName={latestActivity.actorName}
                            time={latestActivity.time}
                        />
                    ));
                    break;
                case "DONATION_RECEIVED":
                    toast.custom(
                        () => (
                            <DonationNotification
                                donorName={latestActivity.actorName}
                                amount={latestActivity.amount}
                            />
                        ),
                        {
                            position: "top-center",
                        },
                    );
                default:
                    break;
            }
        };
        const isUsernamePage = () => {
            const pathSegments = pathname?.split("/");
            return (
                params?.username &&
                pathSegments?.length === 2 &&
                pathSegments[1] !== ""
            );
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

        notificationFeed.get({ limit: 2, mark_seen: true }).then((response) => {
            try {
                const validatedNotificationsResponse =
                    NotificationDTO.feedResponseSchema.parse(response);
                setnotificationFeed(validatedNotificationsResponse);
                setResult(validatedNotificationsResponse.results);
                validatedNotificationsResponse.results.forEach((result) => {
                    setNotifications((prev) => {
                        const uniqueActivities = [...result.activities, ...prev]
                            .filter((activity) => activity.actor !== user.id)
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
    }, [data, params?.username, pathname, router, user?.id, user]);

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
