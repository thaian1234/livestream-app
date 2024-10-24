"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

export const incomingVideoSettings = ["auto", "1080p", "720p", "480p", "off"];
export function VideoQualitySelectorDemo() {
    const [selectedSetting, setSelectedSetting] = useState("auto");
    const handleSelectChange = (value: string) => {
        setSelectedSetting(value);
    };
    return (
        <HoverCard openDelay={0} closeDelay={200}>
            <HoverCardTrigger asChild>
                <Button size="sm" className="w-[65px] bg-white/10 text-white">
                    {selectedSetting}
                </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-[65px] border-0 bg-black-0/60 p-0">
                <ul className="py-1">
                    {incomingVideoSettings.map((quality, index) => (
                        <li
                            key={index}
                            className={cn(
                                "cursor-pointer px-2 py-1 text-sm hover:text-teal-2",
                                quality === selectedSetting && "bg-white/10",
                            )}
                            onClick={() => handleSelectChange(quality)}
                        >
                            {quality}
                        </li>
                    ))}
                </ul>
            </HoverCardContent>
        </HoverCard>
    );
}
