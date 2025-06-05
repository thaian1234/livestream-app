"use client";

import "@/style/video.css";
import { StreamTheme } from "@stream-io/video-react-sdk";

type StreamParams = {
    children: React.ReactNode;
};

export default function StreamLayout({ children }: Readonly<StreamParams>) {
    return <StreamTheme as="section">{children}</StreamTheme>;
}
