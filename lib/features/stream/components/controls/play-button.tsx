import { useParticipantViewContext } from "@stream-io/video-react-sdk";
import { PauseIcon, PlayIcon } from "lucide-react";
import { useState } from "react";

import { TooltipModel } from "@/components/tooltip-model";
import { Button } from "@/components/ui/button";

interface PlayButtonProps {}

export function PlayButton({}: PlayButtonProps) {
    const [isPaused, setIsPaused] = useState(false);
    const { videoElement } = useParticipantViewContext();

    const handlePauseVideo = () => {
        if (videoElement) {
            if (isPaused) {
                videoElement
                    .play()
                    .then(() => {
                        setIsPaused(false);
                    })
                    .catch((error) => {
                        console.error("Error playing video:", error);
                    });
            } else {
                videoElement.pause();
                setIsPaused(true);
            }
        }
    };

    return (
        <TooltipModel content={isPaused ? "Play" : "Pause"} side="bottom">
            <Button
                onClick={handlePauseVideo}
                className="bg-black rounded-full text-white transition-all hover:bg-white/20"
                disabled={!videoElement}
            >
                {isPaused ? <PlayIcon /> : <PauseIcon />}
            </Button>
        </TooltipModel>
    );
}
