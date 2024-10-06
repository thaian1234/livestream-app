import {
    LivestreamLayout,
    ParticipantView,
    useCall,
    useCallStateHooks,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface CustomLivestreamPlayerProps {
    callId: string;
    callType: string;
}

export const CustomLivestreamPlayer = () => {
    const call = useCall();
    const { useParticipants, useIsCallLive } = useCallStateHooks();
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

    return (
        <div className="container aspect-video">
            {/* <LivestreamPlayer
                callId={call.id}
                callType={call.type}
                layoutProps={{
                    showDuration: false,
                    showParticipantCount: false,
                    enableFullScreen: true,
                    showLiveBadge: false,
                    showSpeakerName: false,
                }}
            /> */}
            <LivestreamLayout
                showDuration={false}
                showLiveBadge={false}
                showParticipantCount={false}
            />
            <div>Live: {participants.length}</div>
            {/* {firstParticipant ? (
                <ParticipantView participant={firstParticipant} />
            ) : (
                <div>The host hasnt joined yet</div>
            )} */}
            <div>
                {participants.map((item, i) => (
                    <div key={i}>{item.name}</div>
                ))}
            </div>
            <Button onClick={() => (isLive ? handleStopLive() : handleLive())}>
                {isLive ? "Stop Live" : "Go Live"}
            </Button>
        </div>
    );
};

const CustomLivestreamLayout = () => {
    const { useParticipants, useParticipantCount, useIsCallLive } =
        useCallStateHooks();
    const participantCount = useParticipantCount();
    const [firstParticipant] = useParticipants();
    const isLive = useIsCallLive();
    const call = useCall();

    if (!call) {
        return <Spinner />;
    }

    const handleLive = async () => {
        await call.join({
            create: false,
        });
        await call.goLive();
    };
    const handleStopLive = async () => {
        await call.stopLive();
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div>Live: {participantCount}</div>
            {firstParticipant ? (
                <ParticipantView participant={firstParticipant} />
            ) : (
                <div>The host hasnt joined yet</div>
            )}
            {
                <Button
                    onClick={() => (isLive ? handleStopLive() : handleLive())}
                >
                    {isLive ? "Stop Live" : "Go Live"}
                </Button>
            }
        </div>
    );
};
