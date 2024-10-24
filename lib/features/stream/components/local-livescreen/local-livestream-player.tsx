"use client";

import { MyLivestreamLayout } from "../../layouts/my-stream-layout";

export const LocalLivestreamPlayer = () => {
    return (
        <MyLivestreamLayout
            enableFullScreen={true}
            mirrorLocalParticipantVideo={false}
            showLiveBadge
        />
    );
};
