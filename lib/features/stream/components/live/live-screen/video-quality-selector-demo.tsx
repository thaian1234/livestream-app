"use client";

import { useRef, useState } from "react";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export const incomingVideoSettings = ["auto", "1080p", "720p", "480p", "off"];
export function VideoQualitySelectorDemo() {
    const [isQualityHovered, setIsQualityHovered] = useState(false);
    const [selectedFruit, setSelectedFruit] = useState("auto");
    const handleSelectChange = (value: string) => {
        setSelectedFruit(value);
        console.log(`Selected fruit: ${value}`);
    };

    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const handleSelectClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setIsSelectOpen(true);
    };
    const selectRef = useRef<HTMLDivElement>(null);
    console.log(isSelectOpen);
    return (
        <div ref={selectRef}>
            <Select
                value={selectedFruit}
                onValueChange={handleSelectChange}
                open={isSelectOpen}
                onOpenChange={setIsSelectOpen}
            >
                <SelectTrigger
                    className="w-[100px] border-0 bg-white/10"
                    onClick={handleSelectClick}
                >
                    <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {incomingVideoSettings.map((setting) => (
                            <SelectItem key={setting} value={setting}>
                                {setting}
                            </SelectItem>
                        ))}
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="blueberry">Blueberry</SelectItem>
                        <SelectItem value="grapes">Grapes</SelectItem>
                        <SelectItem value="pineapple">Pineapple</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}
