import { streamApi } from "../apis";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { Channel, DefaultGenerics, StreamChat } from "stream-chat";

import { envClient } from "@/lib/env/env.client";
import { useUser } from "@/lib/hooks/use-user";

export default function useInitializeChatClient(streamId?: string) {
    console.log(streamId);
    const { user } = useUser();
    const { data: tokenData } = streamApi.query.useGetChatToken();
    const [chatClient, setChatClient] = useState<StreamChat | null>(null);
    const [chatChannel, setChatChannel] =
        useState<Channel<DefaultGenerics> | null>();

    useEffect(() => {
        if (!user || !tokenData || !streamId) return;
        const client = StreamChat.getInstance(
            envClient.NEXT_PUBLIC_GETSTREAM_API_KEY,
        );
        console.log("innitatiliez");
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
            .then(() => setChatClient(client));
        const channel = client.channel("livestream", streamId);
        setChatChannel(channel);
        console.log(client);
        return () => {
            // setChatClient(null);
            // client
            //     .disconnectUser()
            //     .catch((error) =>
            //         console.error("Failed to disconnect user: ", error),
            //     )
            //     .then(() => console.log("Connection close"));
        };
    }, [user, tokenData, streamId]);

    return { chatClient, chatChannel };
}
