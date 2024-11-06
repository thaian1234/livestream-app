import { useJoinCall } from "../hooks/use-join-call";
import { StreamCall } from "@stream-io/video-react-sdk";

import { HttpStatus } from "@/server/api/lib/constant/http.type";

import { LiveStreamPlayerState } from "@/components/livestream-player-state";

interface CustomCallProps {
    streamId: string;
    children: React.ReactNode;
}

export function CustomCall({ streamId, children }: CustomCallProps) {
    const { call, isPending, error } = useJoinCall(streamId);

    if (isPending) {
        return (
            <div className="h-[750px] w-full">
                <LiveStreamPlayerState stateMessage="Loading..." isLoading />
            </div>
        );
    }
    if (error) {
        if (error.status === HttpStatus.Forbidden) {
            return (
                <LiveStreamPlayerState stateMessage="User is offline" isError />
            );
        }
        if (error.status === HttpStatus.NotFound) {
            <LiveStreamPlayerState stateMessage="Stream not found" isError />;
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
