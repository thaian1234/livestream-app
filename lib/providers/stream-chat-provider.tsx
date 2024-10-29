"use client";

import { streamApi } from "../features/stream/apis";
import useInitializeChatClient from "../features/stream/hooks/useInitializeChatClient";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import React, { useEffect, useState } from "react";
import { Channel as ChannelType, DefaultGenerics } from "stream-chat";
import { Channel, Chat } from "stream-chat-react";

import { Spinner } from "@/components/ui/spinner";

interface ChatProviderProps {
    streamId: string;
    children: React.ReactNode;
}

export function ChatProvider({ streamId, children }: ChatProviderProps) {
    
    // const { data, isPending, isError } =
    //     streamApi.query.useGetStreamInformation(username);
    const {chatClient, chatChannel} = useInitializeChatClient(streamId);

    if (!chatClient || !chatChannel) return <Spinner />;

    return (
        <Chat client={chatClient}>
            <Channel channel={chatChannel}>{children}</Channel>
        </Chat>
    );
}