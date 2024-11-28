import { NotificationDTO } from "@/server/api/dtos/notification.dto";

import { ScrollArea } from "@/components/ui/scroll-area";

import { NotificationItem } from "./notification-item";

interface NotificationFeedProps {
    notifications: NotificationDTO.Activity[];
}

export function NotificationFeed({ notifications }: NotificationFeedProps) {
    return (
        <ScrollArea className="h-[400px]">
            {notifications.map((notification) => (
                <NotificationItem
                    key={notification.id}
                    notification={notification}
                />
            ))}
        </ScrollArea>
    );
}
