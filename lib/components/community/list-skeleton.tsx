import { Skeleton } from "@/components/ui/skeleton";

export function ListSkeleton() {
    return (
        <div className="h-full w-[calc(100vw-2rem)] flex-grow space-y-4 rounded-lg sm:w-[calc(100vw-7rem)] lg:w-full">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center justify-between px-2">
                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-8 w-20 rounded-md" />
                </div>
            ))}
        </div>
    );
}
