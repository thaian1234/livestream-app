import { useParticipantViewContext } from "@stream-io/video-react-sdk";
import { Volume1, Volume2, VolumeOff } from "lucide-react";
import { useCallback, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { useControlVideoStore } from "@/lib/stores/use-control-video-store";

import { TooltipModel } from "@/components/tooltip-model";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export const VolumeControl = () => {
    const { videoElement } = useParticipantViewContext();
    const [isVolumeHovered, setIsVolumeHovered] = useState(false);
    const { handleVolumeChange, volume } = useControlVideoStore(
        useShallow((state) => ({
            handleVolumeChange: state.handleVolumeChange,
            volume: state.volume,
        })),
    );

    const isMuted = volume === 0 && !!videoElement;

    const updateVideoVolume = useCallback(
        (newVolume: number) => {
            if (videoElement) {
                videoElement.volume = newVolume / 100;
                videoElement.muted = newVolume === 0;
                handleVolumeChange(videoElement, newVolume);
            }
        },
        [handleVolumeChange, videoElement],
    );

    const handleToggleMute = useCallback(() => {
        const newVolume = isMuted ? 50 : 0;
        updateVideoVolume(newVolume);
    }, [isMuted, updateVideoVolume]);

    return (
        <span
            className="relative flex items-center"
            onMouseEnter={() => setIsVolumeHovered(true)}
            onMouseLeave={() => setIsVolumeHovered(false)}
            aria-disabled={!videoElement}
        >
            <TooltipModel content={isMuted ? "Unmute" : "Mute"} side="bottom">
                <Button
                    onClick={handleToggleMute}
                    className="bg-black rounded-full bg-opacity-50 p-2 text-white transition-all hover:bg-opacity-75"
                    disabled={!videoElement}
                >
                    {isMuted && <VolumeOff />}
                    {volume < 50 && volume > 0 && !isMuted && <Volume1 />}
                    {volume >= 50 && !isMuted && <Volume2 />}
                </Button>
            </TooltipModel>
            {isVolumeHovered && !!videoElement && (
                <div className="bg-black absolute left-10 w-40 transform rounded-md bg-opacity-50 p-2">
                    <Slider
                        value={[volume]}
                        onValueChange={(value) =>
                            handleVolumeChange(videoElement, value[0])
                        }
                        max={100}
                        step={1}
                        className="h-1 w-full"
                        disabled={!videoElement}
                    />
                </div>
            )}
        </span>
    );
};
