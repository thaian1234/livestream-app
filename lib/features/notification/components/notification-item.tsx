import { User2Icon, UserMinus2Icon, UserPlus2Icon } from "lucide-react";
import Link from "next/link";

import { ROUTES } from "@/lib/configs/routes.config";

import { NotificationDTO } from "@/server/api/dtos/notification.dto";

import { UserAvatar } from "@/components/user-avatar";

interface NotificationItemProps {
    notification: NotificationDTO.Activity;
}
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 7);
    return date.toLocaleString("vi-VN", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        timeZone: "Asia/Ho_Chi_Minh",
    });
};

export const NotificationItem = ({ notification }: NotificationItemProps) => {
    const renderNotification = () => {
        switch (notification.type) {
            case "NEW_FOLLOWER":
                return (
                    <>
                        <UserPlus2Icon className="mr-2 h-4 w-4 text-blue-500" />
                        <span className="line-clamp-2">
                            {notification.actorName} started following you
                        </span>
                    </>
                );
            case "UNFOLLOW":
                return (
                    <>
                        <UserMinus2Icon className="mr-2 h-4 w-4 text-pink-500" />
                        <span className="line-clamp-2">
                            {notification.actorName} unfollow you
                        </span>
                    </>
                );
            case "BLOCKED":
                return (
                    <>
                        <UserPlus2Icon className="mr-2 h-4 w-4 text-blue-500" />
                        <span className="line-clamp-2">
                            {notification.actorName} blocked you
                        </span>
                    </>
                );
            default:
                return "New notification";
        }
    };

    return (
        <Link
            href={ROUTES.STREAM_PAGE(notification.actorName || "")}
            className="flex items-center gap-2 border-b p-2 last:border-b-0"
        >
            <UserAvatar imageUrl={notification?.actorAvatar} />
            <div className="flex flex-col space-y-1">
                <div className="flex items-start truncate text-sm text-muted-foreground">
                    {renderNotification()}
                </div>
                <p className="text-xs text-muted-foreground">
                    {formatDate(notification.time)}
                </p>
            </div>
        </Link>
    );
};
