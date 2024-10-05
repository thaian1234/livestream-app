"use client";

import { CustomCall } from "../features/stream/components/custom-call";
import { useVideoClient } from "../features/stream/hooks/use-stream-video";
import { StreamVideo } from "@stream-io/video-react-sdk";
import React from "react";

import { Spinner } from "@/components/ui/spinner";

import { useAuth } from "./auth-provider";

interface StreamProviderProps {
    children: React.ReactNode;
}

export function StreamVideoProvider({ children }: StreamProviderProps) {
    const { isPending, stream } = useAuth();
    const { data: videoClient, isError } = useVideoClient();
    if (stream === undefined || isPending) {
        return <Spinner size="large" />;
    }

    if (isError || !videoClient) {
        return <p>Something went wrong</p>;
    }

    return (
        <StreamVideo client={videoClient}>
            <CustomCall streamId={stream.id}>{children}</CustomCall>
        </StreamVideo>
    );
}
