import { UsersRound } from "lucide-react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

export function PreviewSkeleton() {
    return (
        <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((index) => (
                <li key={index}>
                    <AspectRatio
                        ratio={5 / 4}
                        className="min-h-72 overflow-y-hidden"
                    >
                        <div className="h-full w-full font-sans">
                            <AspectRatio
                                ratio={16 / 9}
                                className="rounded-xl bg-muted-foreground/30"
                            >
                                <Skeleton className="h-full w-full" />
                            </AspectRatio>
                            <div className="mt-2 flex items-center space-x-4 px-2">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="w-full space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                    <div className="flex justify-between py-1">
                                        <div className="flex w-2/3 space-x-2">
                                            <Skeleton className="h-4 w-16" />
                                            <Skeleton className="h-4 w-16" />
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <UsersRound
                                                size={16}
                                                className="text-gray-400"
                                            />
                                            <Skeleton className="h-4 w-8" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AspectRatio>
                </li>
            ))}
        </ul>
    );
}
