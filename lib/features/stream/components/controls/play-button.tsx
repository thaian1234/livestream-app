import { useParticipantViewContext } from "@stream-io/video-react-sdk";
import { PauseIcon, PlayIcon } from "lucide-react";

import { useControlVideoStore } from "@/lib/stores/use-control-video-store";

import { TooltipModel } from "@/components/tooltip-model";
import { Button } from "@/components/ui/button";

interface PlayButtonProps {}

export function PlayButton({}: PlayButtonProps) {
    const { videoElement } = useParticipantViewContext();
    const { handleTogglePaused, isPaused } = useControlVideoStore();

    return (
        <TooltipModel content={isPaused ? "Play" : "Pause"} side="bottom">
            <Button
                onClick={() => handleTogglePaused(videoElement)}
                className="bg-black rounded-full text-white transition-all hover:bg-white/20"
                disabled={!videoElement}
            >
                {isPaused ? <PlayIcon /> : <PauseIcon />}
            </Button>
        </TooltipModel>
    );
}
