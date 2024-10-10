"use client";

import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { LiveInformation } from "./livescreen/live-information";
import { MyLivestreamLayout } from "./my-stream-layout";

export const LocalLivestreamPlayer = () => {
    const call = useCall();
    const { useParticipants, useIsCallLive, useLocalParticipant } =
        useCallStateHooks();
    const participants = useParticipants();
    const isLive = useIsCallLive();

    if (!call) {
        return <Spinner />;
    }

    const handleLive = async () => {
        await call.goLive();
    };
    const handleStopLive = async () => {
        await call.stopLive();
    };

    const handleJoin = async () => {
        await call.join({
            create: false,
        });
    };

    return (
        <div className="space-y-4">
            <MyLivestreamLayout
                enableFullScreen={true}
                mirrorLocalParticipantVideo={false}
                showLiveBadge
            />
            <div className="2xl:px-8">
                <LiveInformation />
            </div>
            {/* <div>Live: {participants.length}</div>
            <div>
                {participants.map((item, i) => (
                    <div key={i}>
                        <p>{item.name}</p>
                        <p>{item.roles}</p>
                    </div>
                ))}
            </div> */}
            <Button onClick={() => (isLive ? handleStopLive() : handleLive())}>
                {isLive ? "Stop Live" : "Go Live"}
            </Button>
        </div>
    );
};
