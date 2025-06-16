"use client";

import { CallingState, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useCallback, useEffect } from "react";

import { useStreamVideoContext } from "@/lib/providers/stream-video-context-provider";

import { LiveStreamPlayerState } from "@/components/livestream-player-state";

import { MyLivestreamLayout } from "../../layouts/my-stream-layout";

export const LocalLivestreamPlayer = () => {
    const { useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState();
    const { retry } = useStreamVideoContext();

    const handleRetry = useCallback(() => {
        if (callingState === CallingState.LEFT) {
            retry();
        }
    }, [callingState, retry]);

    useEffect(() => {
        handleRetry();
    }, [handleRetry]);

    switch (callingState) {
        case CallingState.UNKNOWN:
        case CallingState.IDLE:
            <LiveStreamPlayerState stateMessage="Loading..." isLoading />;

        case CallingState.JOINING:
            return (
                <LiveStreamPlayerState
                    stateMessage="Joining Stream"
                    isLoading
                />
            );

        case CallingState.LEFT:
            return <LiveStreamPlayerState stateMessage="Left Stream" />;

        case CallingState.RECONNECTING:
        case CallingState.MIGRATING:
            return (
                <LiveStreamPlayerState
                    stateMessage="Reconnecting stream"
                    isLoading
                />
            );

        case CallingState.RECONNECTING_FAILED:
            return <LiveStreamPlayerState stateMessage="Reconnecting stream" />;

        case CallingState.OFFLINE:
            return <LiveStreamPlayerState stateMessage="User is offline" />;
    }

    return (
        <MyLivestreamLayout
            enableFullScreen={true}
            mirrorLocalParticipantVideo={false}
            showLiveBadge
        />
    );
};
