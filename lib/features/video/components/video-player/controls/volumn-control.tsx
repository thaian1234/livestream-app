"use client";

import { Volume, Volume1, Volume2, VolumeOff } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

import { TooltipModel } from "@/components/tooltip-model";

interface VolumnControlProps {
    muted: boolean;
    volume: number;
    setMuted: React.Dispatch<React.SetStateAction<boolean>>;
    setVolume: React.Dispatch<React.SetStateAction<number>>;
}
export function VolumnControl({
    muted,
    volume,
    setMuted,
    setVolume,
}: VolumnControlProps) {
    const [isVolumeHovered, setIsVolumeHovered] = useState(false);
    const toggleMute = () => setMuted((prev) => !prev);

    return (
        <span
            className="relative flex items-center"
            onMouseEnter={() => setIsVolumeHovered(true)}
            onMouseLeave={() => setIsVolumeHovered(false)}
        >
            <TooltipModel content={muted ? "Unmute" : "Mute"} side="bottom">
                <Button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleMute();
                    }}
                    className="bg-black rounded-full bg-opacity-50 p-2 text-white transition-all hover:bg-opacity-75"
                >
                    {muted && <VolumeOff fill="white" />}
                    {volume === 0 && !muted && <Volume fill="white" />}
                    {volume < 0.5 && volume > 0 && !muted && (
                        <Volume1 fill="white" />
                    )}
                    {volume >= 0.5 && !muted && <Volume2 fill="white" />}
                </Button>
            </TooltipModel>
            {isVolumeHovered && (
                <div className="bg-black absolute left-10 w-40 transform rounded-md bg-opacity-50 p-2">
                    <Slider
                        value={[volume * 100]}
                        onValueChange={(val) => setVolume(val[0] / 100)}
                        max={100}
                        step={1}
                        className="h-1 w-full"
                    />
                </div>
            )}
        </span>
    );
}
