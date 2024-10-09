"use client";

import { CustomCall } from "@/lib/features/stream/components/custom-call";
import { LocalLivestreamPlayer } from "@/lib/features/stream/components/local-livestream-player";
import { useAuth } from "@/lib/providers/auth-provider";
import { StreamVideoProvider } from "@/lib/providers/stream-video-provider";

export default function StreamPage() {
    return (
        <>
            <p>This is livestream page</p>
            <LocalLivestreamPlayer />
        </>
    );
}
