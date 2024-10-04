import { StreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

import { envClient } from "@/lib/env/env.client";
import { streamApi } from "@/lib/features/stream/apis";
import { useUser } from "@/lib/hooks/use-user";

export function useVideoClient() {
    const [videoClient, setVideoClient] = useState<StreamVideoClient>();
    const { user } = useUser();
    const { data: tokenData, isPending } = streamApi.query.useGetStreamToken();

    useEffect(() => {
        if (tokenData === undefined || isPending) {
            return undefined;
        }
        const client = StreamVideoClient.getOrCreateInstance({
            apiKey: envClient.NEXT_PUBLIC_GETSTREAM_API_KEY,
            user: {
                id: user.id,
                name: user.username,
            },
            token:
                tokenData.data.token !== null
                    ? tokenData.data.token
                    : undefined,
            options: {
                enableWSFallback: true,
            },
        });
        setVideoClient(client);
        return () => {
            client.disconnectUser().catch(console.error);
            setVideoClient(undefined);
        };
    }, [user.id, user.username, isPending, tokenData]);

    return videoClient;
}
