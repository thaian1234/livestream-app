"use client";

import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

import {
    IncomingVideoSetting,
    applyIncomingVideoSetting,
    incomingVideoResolutionToSetting,
    incomingVideoSettings,
} from "./video-setting";

const VideoQualitySelector = () => {
    const [selectedSetting, setSelectedSetting] = useState("");

    const call = useCall();
    const { useIncomingVideoSettings } = useCallStateHooks();
    const { enabled, preferredResolution } = useIncomingVideoSettings();
    let currentSetting: IncomingVideoSetting;

    if (!preferredResolution) {
        currentSetting = enabled ? "auto" : "off";
    } else {
        currentSetting = incomingVideoResolutionToSetting(preferredResolution);
    }

    const handleChange = (setting: IncomingVideoSetting) => {
        if (call) {
            applyIncomingVideoSetting(call, setting);
            setSelectedSetting(setting);
        }
    };
    useEffect(() => {
        if (currentSetting) setSelectedSetting(currentSetting);
    }, [currentSetting]);

    return (
        <HoverCard openDelay={0} closeDelay={200}>
            <HoverCardTrigger asChild>
                <Button size="sm" className="w-[65px] bg-white/10 text-white">
                    {selectedSetting}
                </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-[65px] border-0 bg-black-0/60 p-0">
                <ul className="py-1">
                    {incomingVideoSettings.map((setting, index) => (
                        <li
                            key={index}
                            className={cn(
                                "cursor-pointer px-2 py-1 text-sm hover:text-teal-2",
                                setting === currentSetting && "bg-white/10",
                            )}
                            onClick={() => handleChange(setting)}
                        >
                            {setting}
                        </li>
                    ))}
                </ul>
            </HoverCardContent>
        </HoverCard>
    );
};

export { VideoQualitySelector };
