"use client";

import { StreamTheme } from "@stream-io/video-react-sdk";

import { StreamVideoProvider } from "@/lib/providers/stream-video-provider";
import { ChatProvider } from "@/lib/providers/stream-chat-provider";

import "@/style/video.css";

export default function StreamDashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <StreamTheme as="section" className="pt-8">
            <StreamVideoProvider>{children}</StreamVideoProvider>
        </StreamTheme>
    );
}
