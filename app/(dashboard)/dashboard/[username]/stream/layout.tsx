"use client";

import { StreamTheme } from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";

import { CustomCall } from "@/lib/features/stream/layouts/custom-call";
import { useAuth } from "@/lib/providers/auth-provider";
import { StreamVideoProvider } from "@/lib/providers/stream-video-provider";

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
        <StreamTheme as="section" className="pt-8">
            <StreamVideoProvider>
                <CustomCall streamId={stream.id}>{children}</CustomCall>
            </StreamVideoProvider>
        </StreamTheme>
    );
}
