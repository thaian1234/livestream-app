"use client";

import { StreamTheme } from "@stream-io/video-react-sdk";

import "@/style/video.css";

export default function StreamDashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <StreamTheme as="section">{children}</StreamTheme>;
}
