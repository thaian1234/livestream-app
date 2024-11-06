"use client";

import { VideoIcon, VideoOffIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface LiveStreamPlayerStateProps {
    stateMessage: string;
    isLoading?: boolean;
    isError?: boolean;
}

export function LiveStreamPlayerState({
    stateMessage,
    isLoading = false,
    isError = false,
}: LiveStreamPlayerStateProps) {
    return (
        <div className="flex h-full items-center justify-center rounded-xl bg-gray-900/60">
            <div className="flex flex-col items-center justify-center space-y-4 text-muted-foreground">
                {isError && <VideoOffIcon className="size-16" />}
                {!isError && (
                    <VideoIcon
                        className={cn("size-16", isLoading && "animate-spin")}
                    />
                )}
                <p className="text-lg">{stateMessage}</p>
            </div>
        </div>
    );
}
