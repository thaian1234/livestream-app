"use client";

import { CustomCall } from "../features/stream/components/custom-call";
import { useVideoClient } from "../features/stream/hooks/use-stream-video";
import { StreamTheme, StreamVideo } from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import React, { useEffect } from "react";

import { Spinner } from "@/components/ui/spinner";

import { useAuth } from "./auth-provider";

interface StreamProviderProps {
    children: React.ReactNode;
}

export function StreamVideoProvider({ children }: StreamProviderProps) {
    const auth = useAuth();
    const { data: videoClient, isError } = useVideoClient();

    useEffect(() => {
        return () => {
            if (videoClient) {
                videoClient.disconnectUser().catch(() => {
                    console.error("Cannot disconnect user");
                });
            }
        };
    }, [videoClient]);

    if (auth.isPending) {
        return <Spinner size="large" />;
    }

    if (isError || !videoClient || !auth.stream || auth.error) {
        return <p>Something went wrong</p>;
    }

    return (
        <StreamVideo client={videoClient}>
            <CustomCall streamId={auth.stream.id}>{children}</CustomCall>
        </StreamVideo>
    );
}
