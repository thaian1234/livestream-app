import { useParticipantViewContext } from "@stream-io/video-react-sdk";
import { MaximizeIcon, MinimizeIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { useControlVideoStore } from "@/lib/stores/use-control-video-store";

import { Button } from "@/components/ui/button";

import { TooltipModel } from "@/components/tooltip-model";

interface ToggleFullScreenButtonProps {}

export function ToggleFullScreenButton({}: ToggleFullScreenButtonProps) {
    const { participantViewElement } = useParticipantViewContext();
    const { isFullscreen, handleToggleFullscreen: toggleFullscreen } =
        useControlVideoStore();
    const [isFullscreenState, setIsFullscreenState] = useState(isFullscreen);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreenState(
                document.fullscreenElement === participantViewElement,
            );
        };
        window.addEventListener("fullscreenchange", handleFullscreenChange);
        return () =>
            window.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange,
            );
    }, [participantViewElement]);

    return (
        <TooltipModel
            content={isFullscreen ? "Exit full screen" : "Full screen"}
            side="bottom"
        >
            <Button
                onClick={() => toggleFullscreen(participantViewElement)}
                className="bg-black rounded-full text-white transition-all hover:bg-white/30"
            >
                {isFullscreenState ? <MinimizeIcon /> : <MaximizeIcon />}
            </Button>
        </TooltipModel>
    );
}
