"use client";

import { StreamTheme } from "@stream-io/video-react-sdk";

import "@/style/video.css";

type StreamParams = {
    children: React.ReactNode;
};

export default function StreamLayout({ children }: Readonly<StreamParams>) {
    return <StreamTheme as="section">{children}</StreamTheme>;
}
