import { useEffect, useState } from "react";
import { Channel, Event } from "stream-chat";
import { DefaultStreamChatGenerics, useChatContext } from "stream-chat-react";

export default function useStreamerPrivateChats(
    streamerId?: string,
    viewerId?: string,
) {
    const [chats, setChats] = useState<Channel<DefaultStreamChatGenerics>[]>(
        [],
    );
    const { client: chatClient } = useChatContext();

    useEffect(() => {
        const fetchChats = async () => {
            if (!chatClient.userID || !streamerId) return;
            let membersFilter;
            if (viewerId) {
                membersFilter = { $eq: [streamerId, viewerId] };
            } else {
                membersFilter = { $in: [streamerId] };
            }
            const channels = await chatClient.queryChannels(
                {
                    type: "private-stream-chat",
                    members: membersFilter,
                },
                [{ has_unread: -1 }, { last_message_at: -1 }],
            );

            setChats(channels);
        };

        fetchChats();

        const handleEvent = (event: Event<DefaultStreamChatGenerics>) => {
            if (event.type === "message.new") {
                fetchChats();
            }
        };

        chatClient.on(handleEvent);

        return () => chatClient.off(handleEvent);
    }, [streamerId, chatClient, viewerId]);
    return chats;
}
