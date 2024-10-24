"use client";

import { MyLivestreamLayout } from "../../layouts/my-stream-layout";

interface LivestreamPlayerProps {}

export function LivestreamPlayer({}: LivestreamPlayerProps) {
    return (
        <MyLivestreamLayout
            enableFullScreen={true}
            mirrorLocalParticipantVideo={false}
            showLiveBadge
        />
    );
}
