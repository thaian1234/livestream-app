import { Info } from "lucide-react";
import { useMemo } from "react";

import { Hint } from "@/components/hint";

interface ChatInfoProps {
    isDelayed: boolean;
    isFollowersOnly: boolean;
}

export function ChatInfo({ isDelayed, isFollowersOnly }: ChatInfoProps) {
    const hint = useMemo(() => {
        if (isFollowersOnly && !isDelayed) return "Only follwers can chat";

        if (isDelayed && !isFollowersOnly)
            return "Messages are delayed by 3 seconds";

        if (isDelayed && isFollowersOnly)
            return "Only follwers can chat. Messages are delayed by 3 seconds";

        return "";
    }, [isDelayed, isFollowersOnly]);

    const label = useMemo(() => {
        if (isFollowersOnly && !isDelayed) return "Follwers only";

        if (isDelayed && !isFollowersOnly) return "Slow mode";

        if (isDelayed && isFollowersOnly) return "Follwers only and slow mode";

        return "";
    }, [isDelayed, isFollowersOnly]);

    if (!isDelayed && !isFollowersOnly) return null;

    return (
        <div className="flex w-full items-center gap-x-2 rounded-t-md border border-white/10 bg-white/5 p-2 text-muted-foreground">
            <Hint label={hint} side="bottom">
                <Info className="size-4" />
            </Hint>
            <p className="text-xs font-semibold">{label}</p>
        </div>
    );
}
