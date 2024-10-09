import { useParticipantViewContext } from "@stream-io/video-react-sdk";
import { useCallback, useState } from "react";

export const useToggleFullScreen = () => {
    const { participantViewElement } = useParticipantViewContext();
    const [isFullscreen, setIsFullscreen] = useState(false);
    return useCallback(() => {
        if (isFullscreen) {
            setIsFullscreen(false);
            document.exitFullscreen().catch(() => {});
        } else {
            setIsFullscreen(true);
            participantViewElement?.requestFullscreen().catch(() => {});
        }
    }, [isFullscreen, participantViewElement]);
};
