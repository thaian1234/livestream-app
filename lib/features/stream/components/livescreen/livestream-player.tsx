"use client";

import { MyLivestreamLayout } from "../../layouts/my-stream-layout";
import { CallingState, useCallStateHooks } from "@stream-io/video-react-sdk";

interface LivestreamPlayerProps {}

export function LivestreamPlayer({}: LivestreamPlayerProps) {
    const { useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState();

    switch (callingState) {
        case CallingState.UNKNOWN:
        case CallingState.IDLE:
            return <p>Lobby state</p>;

        case CallingState.JOINING:
            return <p>Joining state</p>;

        case CallingState.LEFT:
            return <p>Left state</p>;

        case CallingState.RECONNECTING:
        case CallingState.MIGRATING:
            return <p>Restore state</p>;

        case CallingState.RECONNECTING_FAILED:
            return <p>Reconnec failed state</p>;

        case CallingState.OFFLINE:
            return <p>Offline state</p>;
    }
    return (
        <MyLivestreamLayout
            enableFullScreen={true}
            mirrorLocalParticipantVideo={false}
            showLiveBadge
        />
    );
}
