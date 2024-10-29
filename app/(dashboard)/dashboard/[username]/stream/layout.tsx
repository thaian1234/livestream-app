"use client";

import { StreamTheme } from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";

import { CustomCall } from "@/lib/features/stream/components/local-livescreen/custom-call";
import { useAuth } from "@/lib/providers/auth-provider";
import { StreamVideoProvider } from "@/lib/providers/stream-video-provider";
import { ChatProvider } from "@/lib/providers/stream-chat-provider";

export default function StreamDashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { stream, isPending } = useAuth();
    if (isPending || !stream) {
        return <p>Loading...</p>;
    }

    return (
        <StreamTheme as="section">
            <ChatProvider streamId={stream.id}>
                <StreamVideoProvider>
                    <CustomCall streamId={stream.id}>{children}</CustomCall>
                </StreamVideoProvider>
            </ChatProvider>
        </StreamTheme>
    );
}
