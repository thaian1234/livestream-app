import { StreamCall } from "@stream-io/video-react-sdk";

import { HttpStatus } from "@/server/api/lib/constant/http.type";

import { LiveStreamPlayerState } from "@/components/livestream-player-state";

import { useJoinCall } from "../hooks/use-join-call";

interface CustomCallProps {
    streamId: string;
    children: React.ReactNode;
}

export function CustomCall({ streamId, children }: CustomCallProps) {
    const { call, isPending, error } = useJoinCall(streamId);

    if (isPending) {
        <LiveStreamPlayerState stateMessage="Loading..." isLoading />;
    }
    if (error) {
        if (error.status === HttpStatus.Forbidden) {
            return (
                <LiveStreamPlayerState stateMessage="User is offline" isError />
            );
        }
        if (error.status === HttpStatus.NotFound) {
            return (
                <LiveStreamPlayerState
                    stateMessage="Stream not found"
                    isError
                />
            );
        }
        return (
            <LiveStreamPlayerState
                stateMessage="Cannot connect to the stream"
                isError
            />
        );
    }

    return <StreamCall call={call}>{children}</StreamCall>;
}
