import { useNotification } from "../../../providers/notification-provider";
import { Bell, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { NotificationFeed } from "./notification-feed";

export function NotificationPopover() {
    const { notifications } = useNotification();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="size-6" />
                    {true && (
                        <span className="absolute right-1 top-1 size-2 rounded-full bg-red-500" />
                    )}
                    <span className="sr-only">Show notifications</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
                <div className="border-b p-4 text-sm font-medium">
                    Notifications
                </div>
                <NotificationFeed notifications={notifications} />
            </PopoverContent>
        </Popover>
    );
}
