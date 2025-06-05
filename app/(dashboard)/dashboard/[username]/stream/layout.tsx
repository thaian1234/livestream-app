"use client";

import "@/style/video.css";
import { StreamTheme } from "@stream-io/video-react-sdk";

export default function StreamDashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <StreamTheme as="section">{children}</StreamTheme>;
}
