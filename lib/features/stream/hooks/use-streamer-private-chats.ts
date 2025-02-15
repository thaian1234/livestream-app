import { useEffect, useState } from "react";
import { Channel } from "stream-chat";
import { DefaultStreamChatGenerics, useChatContext } from "stream-chat-react";

export default function useStreamerPrivateChats(streamerId?: string) {
    const [chats, setChats] = useState<Channel<DefaultStreamChatGenerics>[]>(
        [],
    );
    const { client: chatClient } = useChatContext();

    useEffect(() => {
        const fetchChats = async () => {
            if (!chatClient.userID || !streamerId) return;

            const channels = await chatClient.queryChannels(
                {
                    type: "private-stream-chat",
                    members: { $in: [streamerId] },
                },
                [{ has_unread: -1 }, { last_message_at: -1 }],
            );

            setChats(channels);
        };

        fetchChats();
    }, [streamerId, chatClient]);

    return chats;
}
