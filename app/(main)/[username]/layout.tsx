"use client";

import { StreamTheme } from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useParams } from "next/navigation";
import { Channel, Chat } from "stream-chat-react";

import { streamApi } from "@/lib/features/stream/apis";
import { CustomCall } from "@/lib/features/stream/components/local-livescreen/custom-call";
import useInitializeChatClient from "@/lib/features/stream/hooks/useInitializeChatClient";
import { useAuth } from "@/lib/providers/auth-provider";
import { StreamVideoProvider } from "@/lib/providers/stream-video-provider";

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
