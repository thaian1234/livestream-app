"use client";

import { CustomCall } from "../features/stream/components/custom-call";
import { useVideoClient } from "../features/stream/hooks/use-stream-video";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import React from "react";

import { Spinner } from "@/components/ui/spinner";

import { useAuth } from "./auth-provider";

interface StreamProviderProps {
    children: React.ReactNode;
}

export function StreamVideoProvider({ children }: StreamProviderProps) {
    const { isPending, stream } = useAuth();
    const videoClient = useVideoClient();
    if (!videoClient || stream === undefined || isPending) {
        return <Spinner size="large" />;
    }

    return (
        <StreamVideo client={videoClient}>
            <CustomCall streamId={stream.id}>{children}</CustomCall>
        </StreamVideo>
    );
}
