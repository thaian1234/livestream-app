"use client";

import { useVideoClient } from "../features/stream/hooks/use-stream-video";
import {
    StreamVideo,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import React, {  } from "react";

import { Spinner } from "@/components/ui/spinner";


interface StreamProviderProps {
    children: React.ReactNode;
}

export function StreamVideoProvider({ children }: StreamProviderProps) {
    const { videoClient, isError, isPending } = useVideoClient();
    if (isPending) {
        return <Spinner />;
    }

    if (!videoClient || isError) {
        return <p>Stream video failed</p>;
    }

    return <StreamVideo client={videoClient}>{children}</StreamVideo>;
}
