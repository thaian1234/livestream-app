import { LiveStreamPlayerState } from "./livestream-player-state";
import { Skeleton } from "./ui/skeleton";

export function LoadingStreamPage() {
    return (
        <div className="flex min-h-[750px] space-x-4">
            <div className="flex w-[75%] flex-col space-y-4">
                {/* Livestream Player */}
                <div className="aspect-video">
                    <LiveStreamPlayerState
                        stateMessage="Loading..."
                        isLoading
                    />
                </div>
            </div>
            {/* Chat */}
            <div className="flex-grow">
                <Skeleton className="size-full" />
            </div>
        </div>
    );
}
