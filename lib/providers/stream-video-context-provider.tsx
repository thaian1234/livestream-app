"use client";

import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import React, { createContext, useContext } from "react";

import { LiveStreamPlayerState } from "@/components/livestream-player-state";

import { useVideoClient } from "../features/stream/hooks/use-stream-video";

interface StreamVideoContextType {
    videoClient: StreamVideoClient | null;
    isError: boolean;
    isPending: boolean;
    retry: () => void;
}

const StreamVideoContext = createContext<StreamVideoContextType | undefined>(
    undefined,
);

interface StreamProviderProps {
    children: React.ReactNode;
}

export function StreamVideoContextProvider({ children }: StreamProviderProps) {
    const { videoClient, isError, isPending, retry } = useVideoClient();

    const contextValue: StreamVideoContextType = {
        videoClient,
        isError,
        isPending,
        retry,
    };

    if (!videoClient || isError || isPending) {
        return null;
    }

    return (
        <StreamVideoContext.Provider value={contextValue}>
            <StreamVideo client={videoClient}>{children}</StreamVideo>
        </StreamVideoContext.Provider>
    );
}

export function useStreamVideoContext(): StreamVideoContextType {
    const context = useContext(StreamVideoContext);
    if (context === undefined) {
        throw new Error(
            "useStreamVideoContext must be used within a StreamVideoProvider",
        );
    }
    return context;
}
