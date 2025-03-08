import { PictureInPicture } from "lucide-react";
import ReactPlayer from "react-player";

import { Button } from "@/components/ui/button";

interface PipButtonProps {
    playerRef: React.RefObject<ReactPlayer>;
}
export function PipButton({ playerRef }: PipButtonProps) {
    const togglePiP = () => {
        if (playerRef.current) {
            const videoElement = playerRef.current.getInternalPlayer();
            if (videoElement && document.pictureInPictureElement) {
                document.exitPictureInPicture();
            } else if (videoElement?.requestPictureInPicture) {
                videoElement.requestPictureInPicture();
            }
        }
    };
    return (
        <Button
            onClick={(e) => {
                e.stopPropagation();
                togglePiP();
            }}
            className="bg-transparent text-white"
        >
            <PictureInPicture strokeWidth={3} />
        </Button>
    );
}
