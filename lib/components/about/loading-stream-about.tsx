import { LiveStreamPlayerState } from "@/components/livestream-player-state";

export function LoadingStreamAbout() {
    return (
        <div className="aspect-[2/1] max-h-[calc(100vh-7rem)] w-full rounded-lg border border-slate-700">
            {/* Livestream Player */}
            <LiveStreamPlayerState stateMessage="Loading..." isLoading />
        </div>
    );
}
