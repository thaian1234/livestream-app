import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useQuery } from "@tanstack/react-query";

import { useVideoClient } from "./use-stream-video";

export function useJoinCall(streamId: string) {
    const { data: videoClient, isPending } = useVideoClient();

    return useQuery<Call | null, Error>({
        queryKey: ["call"],
        queryFn: async () => {
            if (!videoClient) return null;

            const myCall = videoClient.call("livestream", streamId);
            await myCall.join({ create: false }).catch(console.error);
            return myCall;
        },
        enabled: !!videoClient,
        refetchOnMount: true,
        staleTime: 0,
    });
}
