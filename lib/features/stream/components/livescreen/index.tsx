"use client";

import { ArrowLeftToLine, Pause, Play } from "lucide-react";
import { useState } from "react";
import React from "react";

import { useLiveInfor } from "@/lib/stores/store-live-infor";
import { useSidebar } from "@/lib/stores/store-sidebar";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { TooltipModel } from "@/components/tooltip-model";

import { CinemaModeButton } from "./cinema-mode-button";
import { FullScreenButton } from "./full-screen-button";
import { LivestreamPlayer } from "./livestream-player";
import { MiniplayerButton } from "./miniplayer-button";
import { VideoQualitySelectorDemo } from "./video-quality-selector-demo";
import { VolumnButton } from "./volumn-button";

export function LiveScreen() {
    const { isHideSidebar, isOpenSidebar } = useSidebar();
    const { onToggleChatComponent, isOpenChatComponent } = useLiveInfor();

    const [isHovered, setIsHovered] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const handlePlayLive = () => {
        setIsPaused(!isPaused);
    };

    return (
        // <div
        //     className="relative"
        //     onMouseEnter={() => setIsHovered(true)}
        //     onMouseLeave={() => setIsHovered(false)}
        // >
        //     {/* <div
        //         onClick={handlePlayLive}
        //         className={cn(
        //             "max-w-auto max-h-[calc(100vh-10rem)] w-full cursor-pointer rounded-xl bg-white/30",
        //             isOpenSidebar === false ? "aspect-[2/1]" : "aspect-[16/9]",
        //             isHideSidebar && "aspect-[16/9] max-h-[calc(100vh-5rem)]", //cinema mode
        //         )}
        //     ></div> */}
        //     {/* {isHovered && (
        //         <>
        //             <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black-0 to-transparent opacity-60" />
        //             <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black-0 to-transparent opacity-60" />
        //             <div className="absolute right-0 top-0 flex items-center justify-between space-x-2 p-4">
        //                 <Button
        //                     size="sm"
        //                     className="rounded bg-red-600 px-2 py-1 text-white"
        //                 >
        //                     TRỰC TIẾP
        //                 </Button>
        //                 {!isOpenChatComponent && (
        //                     <TooltipModel content="Expand" side="bottom">
        //                         <button onClick={onToggleChatComponent}>
        //                             <ArrowLeftToLine className="text-white" />
        //                         </button>
        //                     </TooltipModel>
        //                 )}
        //             </div>
        //             <div className="absolute bottom-4 left-4 right-4 flex transform items-center justify-between space-x-4">
        //                 <div className space-x-2>
        //                     <TooltipModel
        //                         content={isPaused ? "Play" : "Pause"}
        //                         side="bottom"
        //                     >
        //                         <Button
        //                             onClick={handlePlayLive}
        //                             className="bg-black rounded-full text-white transition-all hover:bg-white/20"
        //                         >
        //                             {isPaused ? (
        //                              <Play strokeWidth={3} />
        //                              ) : (
        //                              <Pause strokeWidth={3} />
        //                             )}
        //                         </Button>
        //                     </TooltipModel>
        //                     <VolumnButton />
        //                 </div>
        //                 <div className="flex space-x-2">
        //                     <VideoQualitySelectorDemo />
        //                     // thay bằng <PiPButton />
        //                      <MiniplayerButton />
        //                      <CinemaModeButton />
        //                      //thay bằng <ToggleFullScreenButton/>
        //                      <FullScreenButton />
        //                 </div>
        //             </div>
        //         </>
        //     )} */}
        // </div>
        <div>
            <LivestreamPlayer />
        </div>
    );
}
