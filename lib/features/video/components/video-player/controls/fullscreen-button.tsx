import { MaximizeIcon, MinimizeIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { TooltipModel } from "@/components/tooltip-model";

interface FullscreenButtonProps {
    playerWrapperRef: React.RefObject<HTMLDivElement>;
}
export function FullscreenButton({ playerWrapperRef }: FullscreenButtonProps) {
    const [fullscreen, setFullscreen] = useState(false);
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            if (playerWrapperRef.current?.requestFullscreen) {
                playerWrapperRef.current.requestFullscreen();
            }
            setFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            setFullscreen(false);
        }
    };
    return (
        <TooltipModel
            content={fullscreen ? "Exit full screen" : "Full screen"}
            side="bottom"
        >
            <Button
                onClick={(e) => {
                    e.stopPropagation();
                    toggleFullscreen();
                }}
                className="bg-black rounded-full text-white transition-all hover:bg-white/30"
            >
                {fullscreen ? (
                    <MinimizeIcon strokeWidth={3} />
                ) : (
                    <MaximizeIcon strokeWidth={3} />
                )}
            </Button>
        </TooltipModel>
    );
}
