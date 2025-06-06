"use client";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import React from "react";
import { DefaultGenerics } from "stream-chat";
import { Channel, Chat, EventComponentProps } from "stream-chat-react";
import { EmojiPicker } from "stream-chat-react/emojis";

import { Skeleton } from "@/components/ui/skeleton";

import { CustomSystemMessage } from "../features/stream/components/chat/custom-system-message";
import useInitializeChatClient from "../features/stream/hooks/useInitializeChatClient";

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
    viewerId,
}: ChatProviderProps) {
    const { chatClient, chatChannel } = useInitializeChatClient(
        streamId,
        streamerId,
        viewerId,
    );
    if (!chatClient || !chatChannel)
        return <Skeleton className="h-[calc(100vh-7rem)]" />;

    return (
        <Chat client={chatClient}>
            <Channel
                reactionOptions={customReactionOptions}
                EmojiPicker={EmojiPicker}
                channel={chatChannel}
                MessageSystem={
                    CustomSystemMessage as React.ComponentType<
                        EventComponentProps<DefaultGenerics>
                    >
                }
            >
                {children}
            </Channel>
        </Chat>
    );
}
