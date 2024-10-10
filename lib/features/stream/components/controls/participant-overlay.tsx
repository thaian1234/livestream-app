import { useToggleFullScreen } from "../../hooks/use-toggle-fullscreen";
import {
    formatDuration,
    useUpdateCallDuration,
} from "../../hooks/use-update-call-duration";
import { CinemaModeButton } from "../live/live-screen/cinema-mode-button";
import { MiniplayerButton } from "../live/live-screen/miniplayer-button";
import {
    useCallStateHooks,
    useI18n,
    useParticipantViewContext,
} from "@stream-io/video-react-sdk";

import { LiveBadge } from "@/components/live-badge";

import { PlayButton } from "./play-button";
import { ToggleFullScreenButton } from "./toggle-fullscreen-button";
import { VolumeControl } from "./volumn-control";

interface ParticipantOverlayProps {
    enableFullScreen?: boolean;
    showParticipantCount?: boolean;
    showDuration?: boolean;
    showLiveBadge?: boolean;
    showSpeakerName?: boolean;
    isLive?: boolean;
}

export const ParticipantOverlay = ({
    enableFullScreen,
    showDuration,
    showLiveBadge,
    showParticipantCount,
    showSpeakerName,
    isLive,
}: ParticipantOverlayProps) => {
    return (
        <section className="str-video__livestream-layout__overlay">
            {isLive && (
                <span className="absolute right-2 top-2">
                    <LiveBadge className="text-lg font-normal" />
                </span>
            )}
            <div className="flex items-center justify-between p-4">
                <div className="flex">
                    <PlayButton />
                    <VolumeControl />
                </div>
                <div className="flex">
                    <MiniplayerButton />
                    <CinemaModeButton />
                    <ToggleFullScreenButton />
                </div>
            </div>
        </section>
    );
};
