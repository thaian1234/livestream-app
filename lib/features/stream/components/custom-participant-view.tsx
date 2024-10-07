import {
    CallControls,
    useParticipantViewContext,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

import { AudioVolumeIndicator } from "./audio-indicator";
import { ToggleFullScreenButton } from "./toggle-fullscreen-button";

export function CustomParticipantViewUI() {
    return (
        <div className="absolute bottom-0 flex w-full justify-between bg-slate-400">
            <ToggleFullScreenButton />
            <AudioVolumeIndicator />
        </div>
    );
}
