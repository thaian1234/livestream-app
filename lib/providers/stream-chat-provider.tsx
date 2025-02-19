"use client";

import useInitializeChatClient from "../features/stream/hooks/useInitializeChatClient";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import React from "react";
import { Channel, Chat } from "stream-chat-react";
import { EmojiPicker } from "stream-chat-react/emojis";

import { Skeleton } from "@/components/ui/skeleton";

const customReactionOptions = [
    {
        type: "arrow_up",
        Component: () => <>⬆️</>,
        name: "Upvote",
    },
    {
        type: "arrow_down",
        Component: () => <>⬇️</>,
        name: "Downvote",
    },
];

interface ChatProviderProps {
    streamId: string;
    children: React.ReactNode;
    streamerId?: string;
    viewerId?: string;
}

export function ChatProvider({
    streamId,
    children,
    streamerId,
    viewerId
}: ChatProviderProps) {
    const { chatClient, chatChannel } = useInitializeChatClient(
        streamId,
        streamerId,
        viewerId
    );
    if (!chatClient || !chatChannel) return <Skeleton className="size-full" />;

    return (
        <Chat client={chatClient}>
            <Channel
                reactionOptions={customReactionOptions}
                EmojiPicker={EmojiPicker}
                channel={chatChannel}
            >
                {children}
            </Channel>
        </Chat>
    );
}
