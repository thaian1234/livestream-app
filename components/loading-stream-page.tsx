import { LiveStreamPlayerState } from "./livestream-player-state";
import { Skeleton } from "./ui/skeleton";

export function LoadingStreamPage() {
    return (
        <div className="flex max-h-[750px] space-x-6">
            <div className="flex w-[75%] flex-col space-y-4">
                {/* Livestream Player */}
                <div className="aspect-video">
                    <LiveStreamPlayerState
                        stateMessage="Loading..."
                        isLoading
                    />
                </div>
                {/* Info */}
                <div className="h-24">
                    <Skeleton className="size-full" />
                </div>
            </div>
            {/* Chat */}
            <div className="flex-grow">
                <Skeleton className="size-full" />
            </div>
        </div>
    );
}
