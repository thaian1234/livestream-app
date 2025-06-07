import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSkeleton() {
    return (
        <div className="space-y-4 p-6 text-center lg:min-w-[300px] xl:min-w-[400px]">
            <Skeleton className="mx-auto h-[150px] w-[150px] rounded-full" />
            <Skeleton className="mx-auto h-6 w-32" />
            <div className="flex justify-around">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mx-auto h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mx-auto h-4 w-5/6" />
            </div>
            <Skeleton className="mx-auto h-10 w-full rounded-md" />
        </div>
    );
}
