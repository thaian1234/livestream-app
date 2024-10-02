"use client";

import { CallRoom } from "../features/stream/components/call-room";
import { useVideoClient } from "../features/stream/hooks/use-stream-video";
import { StreamVideo } from "@stream-io/video-react-sdk";
import React from "react";

import { Spinner } from "@/components/ui/spinner";

interface StreamProviderProps {
    children: React.ReactNode;
}

export function StreamVideoProvider({ children }: StreamProviderProps) {
    const videoClient = useVideoClient();
    if (!videoClient) {
        return <Spinner size="large" />;
    }
    return (
        <StreamVideo client={videoClient}>
            <CallRoom>{children}</CallRoom>
        </StreamVideo>
    );
}
