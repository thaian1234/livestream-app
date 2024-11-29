import ProfileSkeleton from "../profile/profile-skeleton";

import { Skeleton } from "@/components/ui/skeleton";

import { ListSkeleton } from "./list-skeleton";

export function CommunitySkeleton() {
    return (
        <div className="flex w-full space-x-6 py-4">
            <ProfileSkeleton />
            <div className="flex w-full flex-col px-4">
                <div className="flex w-full justify-around">
                    <Skeleton className="h-8 w-36" />
                    <Skeleton className="h-8 w-36" />
                    <Skeleton className="h-8 w-36" />
                </div>
                <ListSkeleton />
            </div>
        </div>
    );
}
