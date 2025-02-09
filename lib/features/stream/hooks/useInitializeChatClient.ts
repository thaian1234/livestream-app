import { streamApi } from "../apis";
import { useEffect, useState } from "react";
import { Channel, DefaultGenerics, StreamChat } from "stream-chat";

import { envClient } from "@/lib/env/env.client";
import { useAuth } from "@/lib/providers/auth-provider";

export default function useInitializeChatClient(
    streamId: string,
    streamerId?: string,
) {
    const { user } = useAuth();
    const { data: tokenData } = streamApi.query.useGetChatToken();
    const [chatClient, setChatClient] = useState<StreamChat | null>(null);
    const [chatChannel, setChatChannel] =
        useState<Channel<DefaultGenerics> | null>();

    useEffect(() => {
        if (!user || !tokenData || !streamId) return;
        const client = new StreamChat(envClient.NEXT_PUBLIC_GETSTREAM_API_KEY, {
            enableInsights: true,
            enableWSFallback: true,
            timeout: 10000,
        });
        client
            .connectUser(
                {
                    id: user.id,
                    name: user.username,
                    image: user.imageUrl,
                },
                tokenData.data.token,
            )
            .catch((error) => console.error("Failled to connect user", error))
            .then(() => {
                setChatClient(client);
            });
        let channel;
        if (streamerId) {
            channel = client.channel(
                "private-stream-chat",
                `${streamId.replace(/-/g, "")}${user.id.replace(/-/g, "")}`,
                {
                    member: [streamerId, user.id],
                },
            );
        } else channel = client.channel("livestream", streamId);
        setChatChannel(channel);
        return () => {
            setChatClient(null);
            client
                .disconnectUser()
                .catch((error) =>
                    console.error("Failed to disconnect user: ", error),
                )
                .then(() => console.log("Connection close"));
        };
    }, [streamId, user, tokenData, streamerId]);

    return { chatClient, chatChannel };
}
