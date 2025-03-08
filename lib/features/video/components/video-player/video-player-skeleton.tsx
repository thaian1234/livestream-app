import { Skeleton } from "@/components/ui/skeleton";

export function VideoPlayerSkeleton() {
    return (
        <>
            {/* Video Player */}
            <Skeleton className="aspect-video overflow-hidden rounded-lg" />
            {/* Video Info */}
            <div className="mt-4">
                <Skeleton className="h-6 w-2/3" />
                <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-14 w-14 rounded-full" />
                        <div className="mr-4 space-y-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Skeleton className="h-10 w-14" />
                        <Skeleton className="h-10 w-14" />
                        <Skeleton className="h-10 w-20" />
                        <Skeleton className="h-10 w-12" />
                    </div>
                </div>
                {/* Description */}
                <Skeleton className="mt-4 h-20 w-full rounded-xl" />
            </div>
        </>
    );
}
