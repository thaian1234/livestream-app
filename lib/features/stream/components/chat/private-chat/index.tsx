"use client";

import { BoxChat } from "./box-chat";
import { Preview } from "./preview";

interface PrivateChatProps {
    streamerId?: string;
    setViewerId?: (value?: string) => void;
    viewerId?: string;
}

export function PrivateChat({
    streamerId,
    setViewerId,
    viewerId,
}: PrivateChatProps) {
    return (
        <>
            {viewerId ? (
                <BoxChat setViewerId={setViewerId} />
            ) : (
                <Preview streamerId={streamerId} setViewerId={setViewerId} />
            )}
        </>
    );
}
