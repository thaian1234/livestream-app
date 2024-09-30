"use client";

import { useUser } from "@/lib/hooks/use-user";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileInfo() {
    const { user } = useUser();

    return (
        <>
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input defaultValue={user.username} disabled />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input type="email" defaultValue={user.email} disabled />
            </div>
        </>
    );
}

export function ProfileInfoSkeleton() {
    return (
        <>
            {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="space-y-4">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ))}
        </>
    );
}
