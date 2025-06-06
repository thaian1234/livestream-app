"use client";

import { useParticipantViewContext } from "@stream-io/video-react-sdk";
import { PictureInPicture2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import { TooltipModel } from "@/components/tooltip-model";

const PiPButton = () => {
    const { videoElement } = useParticipantViewContext();
    const [pictureInPictureElement, setPictureInPictureElement] = useState(
        document.pictureInPictureElement,
    );

    useEffect(() => {
        if (!videoElement) return;

        // sync local state
        const handlePictureInPicture = () => {
            setPictureInPictureElement(document.pictureInPictureElement);
        };

        videoElement.addEventListener(
            "enterpictureinpicture",
            handlePictureInPicture,
        );
        videoElement.addEventListener(
            "leavepictureinpicture",
            handlePictureInPicture,
        );

        return () => {
            videoElement.removeEventListener(
                "enterpictureinpicture",
                handlePictureInPicture,
            );
            videoElement.removeEventListener(
                "leavepictureinpicture",
                handlePictureInPicture,
            );
        };
    }, [videoElement]);

    const togglePictureInPicture = () => {
        if (videoElement && pictureInPictureElement !== videoElement)
            return videoElement.requestPictureInPicture().catch(console.error);

        document.exitPictureInPicture().catch(console.error);
    };

    return (
        <TooltipModel
            content={
                pictureInPictureElement === videoElement
                    ? "Leave picture-in-picture"
                    : "Picture-in-picture"
            }
            side="bottom"
        >
            <Button
                disabled={!document.pictureInPictureEnabled}
                onClick={togglePictureInPicture}
                className="bg-black rounded-full text-white transition-all hover:bg-white/30"
            >
                <PictureInPicture2 />
            </Button>
        </TooltipModel>
    );
};

export { PiPButton };
