"use client";

import { Channel, Chat } from "stream-chat-react";

import { streamApi } from "@/lib/features/stream/apis";
import useInitializeChatClient from "@/lib/features/stream/hooks/useInitializeChatClient";

interface Props {
    children: React.ReactNode;
    params: {
        username: string;
    };
}

export default function StreamDashboardLayout({
    children,
    params,
}: Readonly<Props>) {
    const { data, isPending, isError } =
        streamApi.query.useGetStreamInformation(params.username);
    const { chatClient, chatChannel } = useInitializeChatClient(data?.data.stream.id);

    if (isPending || !chatClient || !chatChannel) {
        return <p>Loading...</p>;
    }

    return (
        <Chat client={chatClient}>
            <Channel channel={chatChannel}
            >{children}</Channel>
        </Chat>
    );
}
