import { Maximize, Minimize } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { TooltipModel } from "@/components/tooltip-model";

export function FullScreenButton() {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const handleFullScreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    return (
        <TooltipModel
            content={isFullscreen ? "Exit full screen" : "Full screen"}
            side="left"
        >
            <Button
                onClick={handleFullScreen}
                className="bg-black rounded-full text-white transition-all hover:bg-white/30"
            >
                {" "}
                {isFullscreen ? <Minimize /> : <Maximize />}
            </Button>
        </TooltipModel>
    );
}
