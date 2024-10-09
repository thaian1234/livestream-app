"use client";

import { envClient } from "../env/env.client";
import { streamApi } from "../features/stream/apis";
import { CustomCall } from "../features/stream/components/custom-call";
import { useVideoClient } from "../features/stream/hooks/use-stream-video";
import {
    StreamTheme,
    StreamVideo,
    StreamVideoClient,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import React, { useEffect, useState } from "react";

import { Spinner } from "@/components/ui/spinner";

import { useAuth } from "./auth-provider";

interface StreamProviderProps {
    children: React.ReactNode;
}

export function StreamVideoProvider({ children }: StreamProviderProps) {
    const { user } = useAuth();
    const { data: tokenData } = streamApi.query.useGetStreamToken();
    const [videoClient, setVideoClient] = useState<StreamVideoClient>();

    useEffect(() => {
        if (user === undefined || tokenData === undefined) {
            return;
        }
        const client = StreamVideoClient.getOrCreateInstance({
            apiKey: envClient.NEXT_PUBLIC_GETSTREAM_API_KEY,
            user: {
                id: user.id,
                name: user.username,
            },
            token: tokenData.data.token,
            options: {
                enableWSFallback: true,
                timeout: 10000,
            },
        });
        setVideoClient(client);
        return () => {
            client.disconnectUser().catch(() => {
                console.error("Cannot disconnect user");
            });
        };
    }, [user, tokenData]);

    if (!videoClient) {
        return <p>Loading...</p>;
    }

    return <StreamVideo client={videoClient}>{children}</StreamVideo>;
}
