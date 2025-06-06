import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";

import { useNotification } from "../../../providers/notification-provider";
import { NotificationFeed } from "./notification-feed";

export function NotificationPopover() {
    const { notifications, notificationFeed } = useNotification();
    const [unseenCount, setUnseenCount] = useState(
        notificationFeed?.unseen || 0,
    );
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (notificationFeed) {
            setUnseenCount(notificationFeed.unseen);
        }
    }, [notificationFeed]);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open) {
            setUnseenCount(0);
        }
    };

    if (!notificationFeed) return <Spinner size={"small"} />;

    return (
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    aria-label="Notifications"
                >
                    <Bell
                        className="size-6"
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                    {unseenCount > 0 && (
                        <span className="absolute left-full right-1 top-0 inline-flex size-2 h-5 min-w-[20px] -translate-x-1/2 items-center justify-center rounded-full bg-rose-500 px-1 text-xs font-medium text-white">
                            {unseenCount > 99 ? "99+" : unseenCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                side="bottom"
                className="mt-4 w-[350px] border-slate-500 p-0"
            >
                <div className="flex items-center gap-2 border-b border-gray-700 p-4 text-sm font-medium">
                    <Bell className="size-6" />
                    <p className="text-base font-semibold tracking-wider">
                        Notifications
                    </p>
                </div>
                <NotificationFeed notifications={notifications} />
            </PopoverContent>
        </Popover>
    );
}
