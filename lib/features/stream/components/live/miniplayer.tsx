import { Pause, Play, SquareArrowOutUpLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useLiveInfor } from "@/lib/stores/store-live-infor";

import { TooltipModel } from "@/components/tooltip-model";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";

export function Miniplayer() {
    const [isHovered, setIsHovered] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const { infor, resetLiveScreenStatus } = useLiveInfor();
    const router = useRouter();

    const handlePlayLive = () => {
        setIsPaused(!isPaused);
    };
    const onCloseMiniPlayer = () => {
        resetLiveScreenStatus();
    };
    const navigateLivePage = () => {
        router.push(`/live/${infor.userName.replace(/\s+/g, "-")}`);
        resetLiveScreenStatus();
    };
    return (
        <div
            className={
                "fixed bottom-8 right-8 transition-all duration-300 ease-in-out"
            }
        >
            <div
                className={"relative w-96"}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                    setIsHovered(false);
                }}
            >
                <AspectRatio
                    ratio={16 / 9}
                    className="overflow-hidden rounded-md bg-muted bg-slate-500"
                ></AspectRatio>
                {isHovered && (
                    <div className="absolute inset-0 bg-black-0/20 transition-opacity duration-300">
                        <div className="absolute left-2 right-2 top-2 flex items-center justify-between">
                            <p className="w-auto truncate text-base">
                                {infor.title}
                            </p>
                            <button
                                onClick={onCloseMiniPlayer}
                                className="bg-black rounded-full p-1 text-white transition-all hover:bg-white/10"
                            >
                                <X />
                            </button>
                        </div>
                        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 transform items-center space-x-2">
                            <TooltipModel
                                content={isPaused ? "Play" : "Pause"}
                                side="bottom"
                            >
                                <Button
                                    onClick={handlePlayLive}
                                    className="bg-black rounded-full text-white transition-all hover:bg-white/10"
                                >
                                    {isPaused ? <Play /> : <Pause />}
                                </Button>
                            </TooltipModel>
                            <TooltipModel content="Expand" side="bottom">
                                <Button
                                    onClick={navigateLivePage}
                                    className="bg-black rounded-full text-white transition-all hover:bg-white/10"
                                >
                                    <SquareArrowOutUpLeft />
                                </Button>
                            </TooltipModel>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
