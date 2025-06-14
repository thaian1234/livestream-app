import {
    AxiosError,
    Call,
    useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import { useCallback, useEffect, useRef, useState } from "react";

import { useStreamVideoContext } from "@/lib/providers/stream-video-context-provider";

const MAX_RETRIES = 1;
const RETRY_DELAY = 2000; // 2 seconds

interface JoinCallState {
    call: Call | undefined;
    isPending: boolean;
    isError: boolean;
    error: AxiosError | null;
    retryCount: number;
    isJoined: boolean;
}

export function useJoinCall(streamId: string) {
    const { videoClient } = useStreamVideoContext();
    const [state, setState] = useState<JoinCallState>({
        call: undefined,
        isPending: true,
        isError: false,
        error: null,
        retryCount: 0,
        isJoined: false,
    });

    const callRef = useRef<Call | undefined>();
    const isJoiningRef = useRef(false);
    const mountedRef = useRef(true);
    const retryTimeoutRef = useRef<NodeJS.Timeout>();

    const cleanup = useCallback(async () => {
        if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
            retryTimeoutRef.current = undefined;
        }

        if (callRef.current) {
            try {
                console.log(`Leaving call: ${streamId}`);
                await callRef.current.leave();
            } catch (error) {
                console.warn("Error leaving call:", error);
            } finally {
                callRef.current = undefined;
            }
        }
    }, [streamId]);

    // Join call with retry logic
    const attemptJoin = useCallback(
        async (retryCount: number) => {
            if (!videoClient || isJoiningRef.current || !mountedRef.current) {
                return;
            }

            isJoiningRef.current = true;

            // Update state to show loading
            if (mountedRef.current) {
                setState((prev) => ({
                    ...prev,
                    isPending: true,
                    isError: false,
                    error: null,
                }));
            }

            try {
                // Cleanup any existing call first
                await cleanup();

                // Create new call instance
                const myCall = videoClient.call("livestream", streamId);
                callRef.current = myCall;

                console.log(
                    `Attempting to join call: ${streamId} (attempt ${retryCount + 1})`,
                );

                // Join the call
                await myCall.join({ create: false });

                // Update state with successful join
                if (mountedRef.current) {
                    setState({
                        call: myCall,
                        isPending: false,
                        isError: false,
                        error: null,
                        retryCount,
                        isJoined: true,
                    });
                }

                console.log(`Successfully joined call: ${streamId}`);
            } catch (error) {
                const axiosError = error as AxiosError;
                console.error(
                    `Join attempt ${retryCount + 1} failed for call ${streamId}:`,
                    error,
                );

                // Clear the failed call reference
                callRef.current = undefined;

                if (retryCount < MAX_RETRIES && mountedRef.current) {
                    console.log(
                        `Retrying join in ${RETRY_DELAY}ms... (${retryCount + 1}/${MAX_RETRIES})`,
                    );

                    retryTimeoutRef.current = setTimeout(() => {
                        if (mountedRef.current) {
                            isJoiningRef.current = false;
                            attemptJoin(retryCount + 1);
                        }
                    }, RETRY_DELAY);
                } else {
                    // Final failure
                    if (mountedRef.current) {
                        setState((prev) => ({
                            ...prev,
                            call: undefined,
                            isPending: false,
                            isError: true,
                            error: axiosError,
                            retryCount,
                            isJoined: false,
                        }));
                    }
                }
            } finally {
                if (retryCount === 0) {
                    isJoiningRef.current = false;
                }
            }
        },
        [videoClient, streamId, cleanup],
    );

    // Manual retry function
    const retry = useCallback(() => {
        if (!isJoiningRef.current && mountedRef.current && videoClient) {
            attemptJoin(0);
        }
    }, [attemptJoin, videoClient]);

    // Leave call function
    const leave = useCallback(async () => {
        await cleanup();
        if (mountedRef.current) {
            setState((prev) => ({
                ...prev,
                call: undefined,
                isJoined: false,
                isPending: false,
                isError: false,
                error: null,
            }));
        }
    }, [cleanup]);

    // Effect to handle joining
    useEffect(() => {
        mountedRef.current = true;

        if (!videoClient) {
            setState((prev) => ({
                ...prev,
                isPending: false,
                isError: false,
                call: undefined,
                isJoined: false,
            }));
            return;
        }

        if (!streamId) {
            console.warn("No streamId provided to useJoinCall");
            setState((prev) => ({
                ...prev,
                isPending: false,
                isError: true,
                error: new AxiosError("No streamId provided") as AxiosError,
                isJoined: false,
            }));
            return;
        }

        // Start join attempt
        attemptJoin(0);

        // Cleanup function
        return () => {
            mountedRef.current = false;
            isJoiningRef.current = false;
            cleanup();
        };
    }, [videoClient, streamId, attemptJoin, cleanup]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            mountedRef.current = false;
        };
    }, []);

    return {
        ...state,
        retry,
        leave,
    };
}
