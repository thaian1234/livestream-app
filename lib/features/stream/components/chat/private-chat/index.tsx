"use client";

import { useViewerId } from "@/lib/stores/store-viewer-id-chat";

import { BoxChat } from "./box-chat";
import { Preview } from "./preview";

interface PrivateChatProps {
    streamerId?: string;
}

export function PrivateChat({ streamerId }: PrivateChatProps) {
    const { viewerId } = useViewerId();

    return (
        <>
            {viewerId ? (
                <BoxChat streamerId={streamerId} />
            ) : (
                <Preview streamerId={streamerId} />
            )}
        </>
    );
}
