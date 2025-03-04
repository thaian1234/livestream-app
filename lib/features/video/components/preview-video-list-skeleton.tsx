import { Skeleton } from "@/components/ui/skeleton";

export function PreviewVideoListSkeleton() {
    return (
        <div className="space-y-4">
            {Array.from({
                length: 6,
            }).map((_, i) => (
                <div key={i} className="flex cursor-pointer gap-2">
                    <div className="relative w-48 flex-shrink-0">
                        <Skeleton className="aspect-video" />
                    </div>
                    <div className="flex-1 space-y-1">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-4 w-1/5" />
                        <Skeleton className="h-4 w-1/5" />
                    </div>
                </div>
            ))}
        </div>
    );
}
