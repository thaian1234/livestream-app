import {
    HeartHandshakeIcon,
    LockIcon,
    UserPlus2Icon,
    VideoIcon,
} from "lucide-react";
import Link from "next/link";

import { ROUTES } from "@/lib/configs/routes.config";
import { formatDate } from "@/lib/helpers/formatData";
import { cn } from "@/lib/utils";

import { NotificationDTO } from "@/server/api/dtos/notification.dto";

import { UserAvatar } from "@/components/user-avatar";

interface NotificationItemProps {
    notification: NotificationDTO.Activity;
}

export const NotificationItem = ({ notification }: NotificationItemProps) => {
    const isBlocked = notification.type === "BLOCKED";
    const renderNotification = () => {
        switch (notification.type) {
            case "NEW_FOLLOWER":
                return (
                    <>
                        <UserPlus2Icon className="mr-2 h-4 w-4 text-blue-500" />
                        <span className="line-clamp-1">
                            {notification.actorName} started following you
                        </span>
                    </>
                );
            case "BLOCKED":
                return (
                    <>
                        <LockIcon className="mr-2 h-4 w-4 text-rose-500" />
                        <span className="line-clamp-1">
                            {notification.actorName} blocked you
                        </span>
                    </>
                );
            case "UN_BLOCKED":
                return (
                    <>
                        <HeartHandshakeIcon className="mr-2 h-4 w-4 text-yellow-300" />
                        <span className="line-clamp-1">
                            {notification.actorName} unblocked you
                        </span>
                    </>
                );
            case "STREAM_START":
                return (
                    <>
                        <VideoIcon className="mr-2 h-4 w-4 text-green-400" />
                        <span className="line-clamp-1">
                            {notification.actorName} started streaming
                        </span>
                    </>
                );
            default:
                return "New notification";
        }
    };

    return (
        <Link
            href={
                isBlocked
                    ? "/"
                    : ROUTES.STREAM_PAGE(notification.actorName || "")
            }
            className={cn(
                "flex items-center gap-2 border-b p-2 last:border-b-0",
                isBlocked && "cursor-not-allowed",
            )}
            prefetch={false}
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
