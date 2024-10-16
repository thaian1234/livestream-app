"use client";

import { LocalLiveInformation } from "./livescreen/local-live-information";
import { MyLivestreamLayout } from "./my-stream-layout";

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
