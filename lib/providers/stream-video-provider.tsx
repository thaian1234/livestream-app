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
    const { videoClient, isError, isPending } = useVideoClient();
    if (isPending) {
        return <Spinner />;
    }

    if (!videoClient || isError) {
        return <p>Stream video failed</p>;
    }

    return <StreamVideo client={videoClient}>{children}</StreamVideo>;
}
