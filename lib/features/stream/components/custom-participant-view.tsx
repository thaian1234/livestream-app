import { ToggleFullScreenButton } from "./toggle-fullscreen-button";
import { VolumeControl } from "./volumn-control";

export function CustomParticipantViewUI() {
    return (
        <div className="absolute bottom-0 flex w-full justify-between bg-slate-400">
            <ToggleFullScreenButton />
            <VolumeControl />
        </div>
    );
}
