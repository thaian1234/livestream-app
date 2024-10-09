import { StreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

import { envClient } from "@/lib/env/env.client";
import { streamApi } from "@/lib/features/stream/apis";
import { useAuth } from "@/lib/providers/auth-provider";

export function useVideoClient() {
    const [state, setState] = useState({
        videoClient: null as StreamVideoClient | null,
        isPending: true,
        isError: false,
    });
    const { user } = useAuth();
    const { data: tokenData } = streamApi.query.useGetStreamToken();

    useEffect(() => {
        if (!user || !tokenData) return;

        setState((prev) => ({ ...prev, isPending: true, isError: false }));

        const client = StreamVideoClient.getOrCreateInstance({
            apiKey: envClient.NEXT_PUBLIC_GETSTREAM_API_KEY,
            user: { id: user.id, name: user.username },
            token: tokenData.data.token,
            options: { enableWSFallback: true, timeout: 10000 },
        });

        setState({ videoClient: client, isPending: false, isError: false });

        return () => {
            client.disconnectUser().catch(console.error);
        };
    }, [user, tokenData]);

    return state;
}
