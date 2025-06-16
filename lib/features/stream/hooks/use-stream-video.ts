import {
    StreamVideoClient,
    User,
    UserRequest,
} from "@stream-io/video-react-sdk";
import { useCallback, useEffect, useRef, useState } from "react";

import { envClient } from "@/lib/env/env.client";
import { streamApi } from "@/lib/features/stream/apis";
import { useAuth } from "@/lib/providers/auth-provider";
import { delay } from "@/lib/utils";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1500;

export function useVideoClient() {
    const [state, setState] = useState({
        videoClient: null as StreamVideoClient | null,
        isPending: true,
        isError: false,
        retryCount: 0,
    });
    const { user, isSignedIn } = useAuth();
    const clientRef = useRef<StreamVideoClient | null>(null);
    const isConnectingRef = useRef(false);

    const { data: authenticatedTokenData } =
        streamApi.query.useGetStreamToken(isSignedIn);
    const { data: anonymousTokenData } =
        streamApi.query.useGetStreamAnonymousToken(!isSignedIn);

    const tokenData = isSignedIn ? authenticatedTokenData : anonymousTokenData;

    const connectWithRetry = useCallback(
        async (retryCount: number): Promise<StreamVideoClient | null> => {
            if (isConnectingRef.current) return null;
            isConnectingRef.current = true;

            setState((prev) => ({ ...prev, isPending: true, isError: false }));

            try {
                if (clientRef.current) {
                    await clientRef.current
                        .disconnectUser()
                        .catch(console.error);
                    clientRef.current = null;
                }

                const getStreamUser: User = user
                    ? {
                          id: user.id,
                          name: user.username,
                          image: user?.imageUrl || "",
                          type: "authenticated",
                      }
                    : {
                          type: "anonymous",
                      };

                const client = StreamVideoClient.getOrCreateInstance({
                    apiKey: envClient.NEXT_PUBLIC_GETSTREAM_API_KEY,
                    user: getStreamUser,
                    token: tokenData?.data?.token,
                    options: { timeout: 10000 },
                });

                clientRef.current = client;

                setState({
                    videoClient: client,
                    isPending: false,
                    isError: false,
                    retryCount,
                });

                isConnectingRef.current = false;
                return client;
            } catch (error) {
                console.error(
                    `Connection attempt ${retryCount + 1} failed:`,
                    error,
                );

                if (retryCount < MAX_RETRIES) {
                    await delay(RETRY_DELAY);
                    isConnectingRef.current = false;
                    return connectWithRetry(retryCount + 1);
                }

                setState((prev) => ({
                    ...prev,
                    isPending: false,
                    isError: true,
                    retryCount,
                }));
                isConnectingRef.current = false;
                return null;
            }
        },
        [user, tokenData],
    );

    const retry = useCallback(() => {
        if (!isConnectingRef.current && tokenData) {
            connectWithRetry(0);
        }
    }, [connectWithRetry, tokenData]);

    useEffect(() => {
        if (!tokenData?.data?.token) {
            setState((prev) => ({ ...prev, isPending: false, isError: false }));
            return;
        }

        connectWithRetry(0);

        return () => {
            isConnectingRef.current = false;
            if (clientRef.current) {
                console.log("Cleaning up video client");
                clientRef.current.disconnectUser().catch(console.error);
                clientRef.current = null;
            }
        };
    }, [connectWithRetry, tokenData?.data?.token]);

    return { ...state, retry };
}
