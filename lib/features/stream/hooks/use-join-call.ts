import {
    AxiosError,
    Call,
    useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

export function useJoinCall(streamId: string) {
    const videoClient = useStreamVideoClient();
    const [state, setState] = useState({
        call: undefined as Call | undefined,
        isPending: true,
        isError: false,
        error: null as AxiosError | null,
        retryCount: 0,
    });

    useEffect(() => {
        if (!videoClient) return;

        const attemptJoin = async (retryCount: number) => {
            setState((prev) => ({ ...prev, isPending: true, isError: false }));
            const myCall = videoClient.call("livestream", streamId);

            try {
                await myCall.join({ create: false });
                setState({
                    call: myCall,
                    isPending: false,
                    isError: false,
                    error: null,
                    retryCount,
                });
            } catch (error) {
                console.error(`Join attempt ${retryCount + 1} failed:`, error);

                if (retryCount < MAX_RETRIES) {
                    setTimeout(() => attemptJoin(retryCount + 1), RETRY_DELAY);
                } else {
                    setState((prev) => ({
                        ...prev,
                        isPending: false,
                        isError: true,
                        error: error as AxiosError,
                        retryCount,
                    }));
                }
            }
        };

        attemptJoin(0);

        return () => {
            videoClient
                .call("livestream", streamId)
                .leave()
                .catch(() => console.error("Failed to leave the call"));
            setState((prev) => ({ ...prev, call: undefined }));
        };
    }, [videoClient, streamId]);

    return state;
}
