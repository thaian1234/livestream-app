import { Volume1, Volume2, VolumeOff, VolumeX } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

import { TooltipModel } from "@/components/tooltip-model";

export function VolumnButton() {
    const [isVolumeHovered, setIsVolumeHovered] = useState(false);
    const [volume, setVolume] = useState(50);
    const [isMuted, setIsMuted] = useState(false);

    const handleMuteVolumn = () => {
        setIsMuted(!isMuted);
    };

    return (
        <span
            className="relative"
            onMouseEnter={() => setIsVolumeHovered(true)}
            onMouseLeave={() => setIsVolumeHovered(false)}
        >
            <TooltipModel content={isMuted ? "Unmute" : "Mute"} side="bottom">
                <Button
                    onClick={handleMuteVolumn}
                    className="bg-black rounded-full bg-opacity-50 p-2 text-white transition-all hover:bg-opacity-75"
                >
                    {isMuted && <VolumeOff />}
                    {volume === 0 && !isMuted && <VolumeX />}
                    {volume < 50 && volume > 0 && !isMuted && <Volume1 />}
                    {volume >= 50 && !isMuted && <Volume2 />}
                </Button>
            </TooltipModel>
            {isVolumeHovered && (
                <div className="bg-black absolute bottom-1 left-10 w-40 transform rounded-md bg-opacity-50 p-2">
                    <Slider
                        value={[volume]}
                        onValueChange={(value) => setVolume(value[0])}
                        max={100}
                        step={1}
                        className="h-1 w-full"
                    />
                </div>
            )}
        </span>
    );
}
