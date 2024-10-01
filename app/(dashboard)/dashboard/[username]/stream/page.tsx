"use client";

import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";

import { envClient } from "@/lib/env/env.client";
import { streamApi } from "@/lib/features/stream/apis";
import { useUser } from "@/lib/hooks/use-user";

import { Button } from "@/components/ui/button";

const API_KEY = envClient.NEXT_PUBLIC_GETSTREAM_API_KEY;

export default function StreamPage() {
    const { user } = useUser();
    const {
        isPending: isGenerating,
        mutate: handleCreateUserToken,
        data,
    } = streamApi.mutation.useGenerateUserToken();
    function handleCreate() {
        handleCreateUserToken({});
    }
    if (isGenerating || data === undefined) {
        return (
            <p>
                Loading stream....
                <Button onClick={handleCreate}>Connect</Button>
            </p>
        );
    }
    const client = StreamVideoClient.getOrCreateInstance({
        apiKey: API_KEY,
        user: {
            id: user.id,
            name: user.username,
        },
        token: data.data.token,
        options: {
            enableWSFallback: true,
        },
    });

    return (
        <StreamVideo client={client}>
            <p>This is livestream page</p>
        </StreamVideo>
    );
}
