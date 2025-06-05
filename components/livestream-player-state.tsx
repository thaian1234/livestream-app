"use client";

import { ArrowLeftToLine, VideoIcon, VideoOffIcon } from "lucide-react";

import { useLiveInfor } from "@/lib/stores/store-live-infor";
import { cn } from "@/lib/utils";

import { TooltipModel } from "./tooltip-model";

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
    const { isOpenChatComponent, onToggleChatComponent } = useLiveInfor();

    return (
        <div className="relative flex aspect-video items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 xl:col-span-9 xl:size-full">
            <div className="absolute inset-x-0 left-0 right-0 top-0 h-14 w-full bg-gradient-to-b from-black-0/60 to-transparent"></div>
            <div className="absolute inset-x-0 right-4 top-0 flex h-14 justify-end">
                {!isOpenChatComponent && (
                    <TooltipModel content="Expand" side="bottom">
                        <button onClick={onToggleChatComponent}>
                            <ArrowLeftToLine />
                        </button>
                    </TooltipModel>
                )}
            </div>
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
