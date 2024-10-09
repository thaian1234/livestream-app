import { useJoinCall } from "../hooks/use-join-call";
import { useVideoClient } from "../hooks/use-stream-video";
import {
    Call,
    StreamCall,
    useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

import { useAuth } from "@/lib/providers/auth-provider";

interface CustomCallProps {
    streamId: string;
    children: React.ReactNode;
}

export function CustomCall({ streamId, children }: CustomCallProps) {
    // const { data: call, isPending, isError } = useJoinCall(streamId);
    const videoClient = useStreamVideoClient();
    const [call, setCall] = useState<Call>();
    const { user } = useAuth();

    useEffect(() => {
        if (!videoClient || user === undefined) return;

        const myCall = videoClient.call("livestream", streamId);
        setCall(myCall);
        myCall
            .join({
                create: false,
            })
            .catch(console.error);
        return () => {
            myCall
                .leave()
                .catch(() => console.error("Failed to leave the call"));
            setCall(undefined);
        };
    }, [streamId, videoClient, user]);

    if (!call) return <p>Loading..</p>;

    return <StreamCall call={call}>{children}</StreamCall>;
}
