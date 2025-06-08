"use client";

import { StreamVideo } from "@stream-io/video-react-sdk";
import React from "react";

import { LiveStreamPlayerState } from "@/components/livestream-player-state";

import { useVideoClient } from "../features/stream/hooks/use-stream-video";

interface StreamProviderProps {
    children: React.ReactNode;
}

export function StreamVideoProvider({ children }: StreamProviderProps) {
    const { videoClient, isError, isPending } = useVideoClient();

    if (isPending) {
        return <LiveStreamPlayerState stateMessage="Loading..." isLoading />;
    }

    if (!videoClient || isError) {
        return (
            <div className="col-span-9 h-[750px]">
                <LiveStreamPlayerState
                    stateMessage="Failed to connect"
                    isError
                />
            </div>
        );
    }

    return <StreamVideo client={videoClient}>{children}</StreamVideo>;
}
