import { CinemaModeButton } from "../livescreen/cinema-mode-button";
import { MiniplayerButton } from "../livescreen/miniplayer-button";
import { useCallStateHooks } from "@stream-io/video-react-sdk";
import { Users2Icon } from "lucide-react";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { LiveBadge } from "@/components/live-badge";
import { Badge } from "@/components/ui/badge";

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
    showParticipantCount = true,
    showSpeakerName,
}: ParticipantOverlayProps) => {
    const { useIsCallLive, useRemoteParticipants } = useCallStateHooks();
    const isLive = useIsCallLive();
    const participants = useRemoteParticipants();
    const [showControls, setShowControls] = useState(false);

    const TopOverlay = () => (
        <article className="absolute inset-x-0 top-0 h-14 bg-gradient-to-t from-black-0/30 to-transparent">
            <div className="absolute left-3 top-3 flex items-center space-x-3">
                {showLiveBadge && <LiveBadge className="text-lg font-normal" />}
                {showParticipantCount && (
                    <Badge
                        variant="secondary"
                        className="text-md bg-transparent font-semibold text-white hover:bg-transparent"
                    >
                        <Users2Icon className="mr-1 h-4 w-4" />
                        <p>{participants.length}</p>
                    </Badge>
                )}
            </div>
        </article>
    );

    const BottomControlsOverlay = () => (
        <article className="absolute inset-x-0 bottom-0 flex h-14 items-center justify-between bg-gradient-to-b from-black-0/30 to-transparent p-4">
            <div className="flex">
                <PlayButton />
                <VolumeControl />
            </div>
            <div className="flex">
                <MiniplayerButton />
                <CinemaModeButton />
                <ToggleFullScreenButton />
            </div>
        </article>
    );

    return (
        <section
            className={cn(
                "str-video__livestream-layout__overlay",
                "m-0 aspect-video p-0",
            )}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            <div
                className={cn(
                    "transition-opacity duration-200",
                    showControls ? "opacity-100" : "opacity-0",
                )}
            >
                {isLive && <TopOverlay />}
                <BottomControlsOverlay />
            </div>
        </section>
    );
};
