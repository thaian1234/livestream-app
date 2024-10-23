import { ToggleFullScreenButton } from "./controls/toggle-fullscreen-button";
import { VolumeControl } from "./controls/volumn-control";
import { PiPButton } from "./live/live-screen/PiP-button";

export function CustomParticipantViewUI() {
    return (
        <div className="absolute bottom-0 flex w-full justify-between bg-slate-400">
            <ToggleFullScreenButton />
            <PiPButton />
            <VolumeControl />
        </div>
    );
}
