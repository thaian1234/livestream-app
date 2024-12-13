import { WifiHighIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/lib/configs/routes.config";
import { formatDate } from "@/lib/helpers/formatData";

import { Button } from "@/components/ui/button";

interface StreamNotificationProps {
    streamerName?: string;
    time: string;
}

export default function StreamNotification({
    streamerName,
    time,
}: StreamNotificationProps) {
    const router = useRouter();
    const formattedTime = formatDate(time);
    const handleRedirect = () => {
        if (streamerName) {
            router.push(ROUTES.STREAM_PAGE(streamerName));
        }
    };
    return (
        // To make the notification fixed, add classes like `fixed bottom-4 right-4` to the container element.
        <div className="shadow-black/5 z-[100] rounded-lg border border-border bg-white p-3 text-black-1 shadow-lg">
            <div className="flex items-center gap-2">
                <div
                    className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border"
                    aria-hidden="true"
                >
                    <WifiHighIcon
                        className="text-green-500 opacity-60"
                        size={24}
                        strokeWidth={2}
                    />
                </div>
                <div className="flex items-center gap-8">
                    <div className="space-y-1">
                        <p className="truncate text-sm font-medium">
                            {streamerName} started streaming
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {formattedTime}
                        </p>
                    </div>
                </div>
                <Button
                    size="sm"
                    onClick={handleRedirect}
                    variant={"secondary"}
                >
                    Watch
                </Button>
            </div>
        </div>
    );
}
