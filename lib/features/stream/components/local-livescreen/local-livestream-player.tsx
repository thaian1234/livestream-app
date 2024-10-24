"use client";

import { MyLivestreamLayout } from "../../layouts/my-stream-layout";

import { LocalLiveInformation } from "./local-live-information";

export const LocalLivestreamPlayer = () => {
    return (
        <div className="space-y-4">
            <MyLivestreamLayout
                enableFullScreen={true}
                mirrorLocalParticipantVideo={false}
                showLiveBadge
            />
            <div className="2xl:px-8">
                <LocalLiveInformation />
            </div>
        </div>
    );
};
