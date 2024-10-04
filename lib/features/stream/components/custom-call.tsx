import { useVideoClient } from "../hooks/use-stream-video";
import { Call, StreamCall } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

import { Spinner } from "@/components/ui/spinner";

interface CustomCallProps {
    streamId: string;
    children: React.ReactNode;
}

export function CustomCall({ streamId, children }: CustomCallProps) {
    const videoClient = useVideoClient();
    const [call, setCall] = useState<Call>();

    useEffect(() => {
        if (!videoClient) return;

        const myCall = videoClient.call("livestream", streamId);
        myCall
            .join({
                create: false,
            })
            .then(() => setCall(myCall));

        return () => {
            myCall
                .leave()
                .catch(() => console.error("Failed to leave the call"));
            setCall(undefined);
        };
    }, [streamId, videoClient]);

    if (!call) {
        return <Spinner />;
    }

    return <StreamCall call={call}>{children}</StreamCall>;
}
