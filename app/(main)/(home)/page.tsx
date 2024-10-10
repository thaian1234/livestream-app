"use client";

import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";
import React from "react";

import { LivesPreview } from "@/lib/features/stream/components/live-preview";
import { Miniplayer } from "@/lib/features/stream/components/live/miniplayer";
import { useLiveInfor } from "@/lib/stores/store-live-infor";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function HomePage() {
    const [isExpanded, setIsExpanded] = useState(false);
    const { liveSrceenStatus } = useLiveInfor();
    const handleShowMore = () => {
        setIsExpanded(!isExpanded);
    };
    return (
        <ScrollArea className="h-[calc(100vh-5rem)] w-full">
            <div className="mx-auto px-10 md:max-w-screen-md lg:max-w-screen-xl 2xl:max-w-screen-2xl 2xl:px-4">
                <h2 className="mb-6 text-2xl font-bold text-white">
                    Welcome to Your Dashboard
                </h2>
                {/* Placeholder content */}
                <div className="grid gap-6 min-[712px]:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
                    <LivesPreview />
                </div>
                <div className="mt-8 flex justify-center">
                    <Button
                        onClick={handleShowMore}
                        className="rounded-full bg-teal-3 text-white"
                    >
                        {isExpanded ? (
                            <>
                                Show Less{" "}
                                <ChevronUpIcon className="ml-2 h-4 w-4" />
                            </>
                        ) : (
                            <>
                                Show More{" "}
                                <ChevronDownIcon className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
            {liveSrceenStatus.miniPlayer && <Miniplayer />}
        </ScrollArea>
    );
}
