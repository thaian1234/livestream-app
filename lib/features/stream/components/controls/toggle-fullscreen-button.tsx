import { useParticipantViewContext } from "@stream-io/video-react-sdk";
import { MaximizeIcon, MinimizeIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { TooltipModel } from "@/components/tooltip-model";
import { Button } from "@/components/ui/button";

interface ToggleFullScreenButtonProps {}

export function ToggleFullScreenButton({}: ToggleFullScreenButtonProps) {
    const { participantViewElement } = useParticipantViewContext();
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(
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

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            participantViewElement?.requestFullscreen().catch((err) => {
                console.warn(
                    `Error attempting to enable fullscreen: ${err.message}`,
                );
            });
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch((err) => {
                    console.warn(
                        `Error attempting to exit fullscreen: ${err.message}`,
                    );
                });
            }
            setIsFullscreen(false);
        }
    };

    return (
        <TooltipModel
            content={isFullscreen ? "Exit full screen" : "Full screen"}
            side="bottom"
        >
            <Button
                onClick={toggleFullscreen}
                className="bg-black rounded-full text-white transition-all hover:bg-white/30"
            >
                {isFullscreen ? <MinimizeIcon /> : <MaximizeIcon />}
            </Button>
        </TooltipModel>
    );
}
