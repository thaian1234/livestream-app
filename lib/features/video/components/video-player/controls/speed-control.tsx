"use client";

import { CircleGauge } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];
interface SpeedControlProps {
    playbackRate: number;
    setPlaybackRate: React.Dispatch<React.SetStateAction<number>>;
}
export function SpeedControl({
    playbackRate,
    setPlaybackRate,
}: SpeedControlProps) {
    return (
        <HoverCard openDelay={0} closeDelay={200}>
            <HoverCardTrigger asChild>
                <Button className="bg-transparent text-white">
                    <CircleGauge strokeWidth={3} />
                </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-[65px] border-0 bg-black-0/60 p-0">
                <ul className="py-1">
                    {speedOptions.map((speedOption, index) => (
                        <li
                            key={index}
                            className={cn(
                                "cursor-pointer px-2 py-1 text-sm hover:text-teal-2",
                                speedOption === playbackRate && "bg-white/20",
                            )}
                            onClick={(e) => {
                                e.stopPropagation();
                                setPlaybackRate(speedOption);
                            }}
                        >
                            {speedOption}
                        </li>
                    ))}
                </ul>
            </HoverCardContent>
        </HoverCard>
    );
}
