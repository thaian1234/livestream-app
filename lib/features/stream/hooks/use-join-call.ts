import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

export function useJoinCall(streamId: string) {
    const videoClient = useStreamVideoClient();
    const [state, setState] = useState({
        call: undefined as Call | undefined,
        isPending: true,
        isError: false,
    });

    useEffect(() => {
        if (!videoClient) return;
        setState((prev) => ({ ...prev, isPending: true, isError: false }));
        const myCall = videoClient.call("livestream", streamId);
        myCall
            .join({ create: false })
            .then(() => {
                setState({ call: myCall, isPending: false, isError: false });
            })
            .catch((error) => {
                console.error(error);
                setState((prev) => ({
                    ...prev,
                    isPending: false,
                    isError: true,
                }));
            });

        return () => {
            myCall
                .leave()
                .catch(() => console.error("Failed to leave the call"));
            setState((prev) => ({ ...prev, call: undefined }));
        };
    }, [videoClient, streamId]);

    return state;
}
