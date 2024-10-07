"use client";

import {
    LivestreamPlayer,
    useCall,
    useCallStateHooks,
} from "@stream-io/video-react-sdk";

import { CustomLivestreamPlayer } from "@/lib/features/stream/components/custom-livestream-player";
import { StreamVideoProvider } from "@/lib/providers/stream-video-provider";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function StreamPage() {
    return (
        <StreamVideoProvider>
            <p>This is livestream page</p>
            <CustomLivestreamPlayer />
        </StreamVideoProvider>
    );
}

const LivestreamView = () => {
    const {
        useCameraState,
        useMicrophoneState,
        useParticipantCount,
        useIsCallLive,
        useParticipants,
        useCallIngress,
        useScreenShareState,
    } = useCallStateHooks();

    const { camera: cam, isEnabled: isCamEnabled } = useCameraState();
    const { microphone: mic, isEnabled: isMicEnabled } = useMicrophoneState();
    const call = useCall();
    const { screenShare, status } = useScreenShareState();
    const ingress = useCallIngress();

    const participantCount = useParticipantCount();
    const isLive = useIsCallLive();

    const [firstParticipant] = useParticipants();
    if (!call) {
        return <Spinner />;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div>{isLive ? `Live: ${participantCount}` : `In Backstage`}</div>
            {firstParticipant ? (
                <LivestreamPlayer callId={call.id} callType={"livestream"} />
            ) : (
                <div>The host hasnt joined yet</div>
            )}
            <div style={{ display: "flex", gap: "4px" }}>
                <Button
                    onClick={() => (isLive ? call.stopLive() : call.goLive())}
                >
                    {isLive ? "Stop Live" : "Go Live"}
                </Button>
                <Button onClick={() => cam.toggle()}>
                    {isCamEnabled ? "Disable camera" : "Enable camera"}
                </Button>
                <Button onClick={() => mic.toggle()}>
                    {isMicEnabled ? "Mute Mic" : "Unmute Mic"}
                </Button>
                <Button onClick={() => screenShare.toggle()}>
                    {status === "enabled" ? "active" : "inactive"}
                </Button>
            </div>
        </div>
    );
};
