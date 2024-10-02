import { AppWindow } from "lucide-react";

import { TooltipModel } from "@/components/tooltip-model";
import { Button } from "@/components/ui/button";

export function MiniplayerButton() {
    const handleMiniPlayer = () => {};

    return (
        <TooltipModel content="Miniplayer" side="bottom">
            <Button
                onClick={handleMiniPlayer}
                className="bg-black rounded-full text-white transition-all hover:bg-white/30"
            >
                <AppWindow />
            </Button>
        </TooltipModel>
    );
}
