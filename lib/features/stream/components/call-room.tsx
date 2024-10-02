import { streamApi } from "../apis";
import { useVideoClient } from "../hooks/use-stream-video";
import { Call, StreamCall } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

import { Spinner } from "@/components/ui/spinner";

interface CallRoomProps {
    children: React.ReactNode;
}

export function CallRoom({ children }: CallRoomProps) {
    const videoClient = useVideoClient();
    const [call, setCall] = useState<Call | undefined>(undefined);
    const { data, isPending } = streamApi.query.useGetLivestreamRoom();

    useEffect(() => {
        if (isPending || !videoClient || data === undefined) {
            return;
        }
        const myCall = videoClient.call(
            data.data.room.call.type,
            data.data.room.call.id,
        );
        return () => {
            myCall
                .leave()
                .catch(() => console.error("Failed to leave the call"));
            setCall(undefined);
        };
    }, [data, isPending, videoClient]);

    if (!call) return <Spinner />;
    return <StreamCall call={call}>{children}</StreamCall>;
}
