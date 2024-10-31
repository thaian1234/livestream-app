"use client";

import { StreamTheme } from "@stream-io/video-react-sdk";

import { StreamVideoProvider } from "@/lib/providers/stream-video-provider";

import "@/style/video.css";

type StreamParams = {
    children: React.ReactNode;
};

export default function StreamLayout({ children }: Readonly<StreamParams>) {
    return (
        <StreamTheme as="section">
            <StreamVideoProvider>{children}</StreamVideoProvider>
        </StreamTheme>
    );
}
