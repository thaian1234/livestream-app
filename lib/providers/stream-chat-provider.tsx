"use client";

import useInitializeChatClient from "../features/stream/hooks/useInitializeChatClient";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import React from "react";
import { Channel, Chat } from "stream-chat-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

interface ChatProviderProps {
    streamId: string;
    children: React.ReactNode;
}

export function ChatProvider({ streamId, children }: ChatProviderProps) {
    const { chatClient, chatChannel } = useInitializeChatClient(streamId);

    if (!chatClient || !chatChannel) return <Skeleton className="size-full" />;

    return (
        <Chat client={chatClient}>
            <Channel channel={chatChannel}>{children}</Channel>
        </Chat>
    );
}
