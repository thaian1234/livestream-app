import { useParticipantViewContext } from "@stream-io/video-react-sdk";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";

interface ToggleFullScreenButtonProps {}

export function ToggleFullScreenButton({}: ToggleFullScreenButtonProps) {
    const { participantViewElement } = useParticipantViewContext();
    const [isFullsreenElement, setIsFullscreenElement] = useState(false);

    const toggleFullscreen = () => {
        if (isFullsreenElement) {
            setIsFullscreenElement(false);
            return document.exitFullscreen();
        }
        setIsFullscreenElement(true);
        return participantViewElement?.requestFullscreen();
    };

    return (
        <Button onClick={toggleFullscreen} variant={"ghost"}>
            {isFullsreenElement ? "Leave" : "Enter"} fullscreen
        </Button>
    );
}
