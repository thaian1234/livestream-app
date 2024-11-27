"use client";

import useInitializeChatClient from "../features/stream/hooks/useInitializeChatClient";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import React, { forwardRef, useCallback } from "react";
import {
    Channel,
    Chat,
    ReactionSelector,
    ReactionSelectorProps,
    ReactionsList,
    ReactionsListProps,
    useChannelStateContext,
    useMessageContext,
} from "stream-chat-react";
import { EmojiPicker } from "stream-chat-react/emojis";

import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { ChatMessage } from "../features/stream/components/chat/chat-message";
import { DefaultGenerics } from "stream-chat";

const customReactionOptions = [
    {
        type: "arrow_up",
        Component: () => <>⬆️</>,
        name: "Upwards Black Arrow",
    },
    {
        type: "arrow_down",
        Component: () => <>⬇️</>,
        name: "Downwards Black Arrow",
    },
];

interface ChatProviderProps {
    streamId: string;
    children: React.ReactNode;
}

   
export function ChatProvider({ streamId, children }: ChatProviderProps) {
    const { chatClient, chatChannel } = useInitializeChatClient(streamId);

    if (!chatClient || !chatChannel) return <Skeleton className="size-full" />;

    return (
        <Chat client={chatClient}>
            <Channel

                // ReactionsList={CustomReactionsList}
                reactionOptions={customReactionOptions}
                EmojiPicker={EmojiPicker}
                channel={chatChannel}
            >
                {children}
            </Channel>
        </Chat>
    );
}
