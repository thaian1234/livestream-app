"use client";

import { CallingState, useCallStateHooks } from "@stream-io/video-react-sdk";

import { LiveStreamPlayerState } from "@/components/livestream-player-state";

import { MyLivestreamLayout } from "../../layouts/my-stream-layout";

interface LivestreamPlayerProps {}

export function LivestreamPlayer({}: LivestreamPlayerProps) {
    const { useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState();

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
            showParticipantCount
        />
    );
}
