import { StreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

import { envClient } from "@/lib/env/env.client";
import { streamApi } from "@/lib/features/stream/apis";
import { useAuth } from "@/lib/providers/auth-provider";

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

export function useVideoClient() {
    const [state, setState] = useState({
        videoClient: null as StreamVideoClient | null,
        isPending: true,
        isError: false,
        retryCount: 0,
    });
    const { user } = useAuth();
    const { data: tokenData } = streamApi.query.useGetStreamToken();

    useEffect(() => {
        if (!user || !tokenData) return;

        const connectWithRetry = async (
            retryCount: number,
        ): Promise<StreamVideoClient | null> => {
            setState((prev) => ({ ...prev, isPending: true, isError: false }));

            try {
                const client = StreamVideoClient.getOrCreateInstance({
                    apiKey: envClient.NEXT_PUBLIC_GETSTREAM_API_KEY,
                    user: { id: user.id, name: user.username },
                    token: tokenData.data.token,
                    options: { timeout: 10000 },
                });

                setState({
                    videoClient: client,
                    isPending: false,
                    isError: false,
                    retryCount,
                });

                return client;
            } catch (error) {
                console.error(
                    `Connection attempt ${retryCount + 1} failed:`,
                    error,
                );

                if (retryCount < MAX_RETRIES) {
                    await new Promise((resolve) =>
                        setTimeout(resolve, RETRY_DELAY),
                    );
                    return connectWithRetry(retryCount + 1);
                }

                setState((prev) => ({
                    ...prev,
                    isPending: false,
                    isError: true,
                    retryCount,
                }));
                return null;
            }
        };

        let client: StreamVideoClient | null = null;
        connectWithRetry(0).then((result) => (client = result));

        return () => {
            if (client) {
                client.disconnectUser().catch(console.error);
            }
        };
    }, [user, tokenData]);
    return state;
}
