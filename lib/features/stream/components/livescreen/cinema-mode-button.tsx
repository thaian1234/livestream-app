import { useParticipantViewContext } from "@stream-io/video-react-sdk";
import { PanelRight } from "lucide-react";
import { useCallback } from "react";

import { useLiveInfor } from "@/lib/stores/store-live-infor";
import { useSidebar } from "@/lib/stores/store-sidebar";

import { Button } from "@/components/ui/button";

import { TooltipModel } from "@/components/tooltip-model";

export function CinemaModeButton() {
    const { liveSrceenStatus } = useLiveInfor();
    const { onHideSidebar, onShowSidebar } = useSidebar();
    // const { participantViewElement } = useParticipantViewContext();

    const handleCinemaMode = () => {
        if (liveSrceenStatus.cinemaMode === true) {
            onShowSidebar();
        } else {
            onHideSidebar();
        }
    };

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
