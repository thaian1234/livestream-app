import { useNotification } from "../../../providers/notification-provider";
import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";

import { NotificationFeed } from "./notification-feed";

export function NotificationPopover() {
    const { notifications, notificationFeed } = useNotification();
    if (!notificationFeed) return <Spinner size={"small"} />;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="size-6" />
                    {notificationFeed.unread > 0 && (
                        <span className="absolute right-1 top-1 size-2 rounded-full bg-red-500" />
                    )}
                    <span className="sr-only">Show notifications</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                side="bottom"
                className="mt-4 w-[350px] border-slate-500 p-0"
            >
                <div className="flex items-center gap-2 border-b p-4 text-sm font-medium">
                    <Bell className="size-6" />
                    <p>Notifications {notificationFeed.unread}</p>
                </div>
                <NotificationFeed notifications={notifications} />
            </PopoverContent>
        </Popover>
    );
}
