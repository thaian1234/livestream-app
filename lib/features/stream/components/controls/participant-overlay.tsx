import { CinemaModeButton } from "../livescreen/cinema-mode-button";
import { MiniplayerButton } from "../livescreen/miniplayer-button";
import {
    useCallStateHooks,
    useI18n,
    useParticipantViewContext,
} from "@stream-io/video-react-sdk";

import { cn } from "@/lib/utils";

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
}

export const ParticipantOverlay = ({
    enableFullScreen,
    showDuration,
    showLiveBadge,
    showParticipantCount,
    showSpeakerName,
}: ParticipantOverlayProps) => {
    const { useIsCallLive } = useCallStateHooks();
    const isLive = useIsCallLive();

    return (
        <section
            className={cn(
                "str-video__livestream-layout__overlay",
                "m-0 aspect-video !w-full p-0",
            )}
        >
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
