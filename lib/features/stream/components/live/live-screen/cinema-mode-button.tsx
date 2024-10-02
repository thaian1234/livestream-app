import { PanelRight } from "lucide-react";

import { useLiveInfor } from "@/lib/stores/store-live-infor";
import { useSidebar } from "@/lib/stores/store-sidebar";

import { TooltipModel } from "@/components/tooltip-model";
import { Button } from "@/components/ui/button";

export function CinemaModeButton() {
    const { setLiveScreenStatus, liveSrceenStatus, resetLiveScreenStatus } =
        useLiveInfor();

    const handleCinemaMode = () => {
        onHideSidebar();
        if (liveSrceenStatus.cinemaMode === true) {
            resetLiveScreenStatus();
        } else {
            setLiveScreenStatus("cinemaMode");
        }
    };
    const { onHideSidebar } = useSidebar();

    return (
        <TooltipModel
            content={
                liveSrceenStatus.cinemaMode ? "Exit cinema mode" : "Cinema mode"
            }
            side="bottom"
        >
            <Button
                onClick={handleCinemaMode}
                className="bg-black rounded-full text-white transition-all hover:bg-white/30"
            >
                <PanelRight />
            </Button>
        </TooltipModel>
    );
}
