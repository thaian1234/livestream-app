"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/providers/auth-provider";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { UserAvatar } from "@/components/user-avatar";

import { EditProfileDialog } from "./edit-profile-dialog";
import ProfileSkeleton from "./profile-skeleton";

interface ProfileProps {
    followers: number;
    followings: number;
}

export function Profile({ followers, followings }: ProfileProps) {
    const { user, isPending: isPending, error } = useAuth();
    if (isPending || !user) {
        return <ProfileSkeleton />;
    }

    return (
        <div className="flex flex-col items-center space-y-4 lg:min-w-[300px] xl:min-w-[400px]">
            <UserAvatar imageUrl={user.imageUrl} size={"xxl"} />
            <p className="max-w-full break-words text-2xl">{user.username}</p>
            <div className="flex w-full justify-around">
                <div>
                    <span className="font-light text-white/50">
                        Followers:{" "}
                    </span>
                    <span>{followers}</span>
                </div>
                <div>
                    <span className="font-light text-white/50">
                        Following:{" "}
                    </span>
                    <span>{followings}</span>
                </div>
            </div>
            <div className="max-w-full whitespace-pre-wrap break-words font-extralight text-white/70">
                {user.bio}
            </div>
            {/* <Link href={`/dashboard/${user.username}/profile`}> */}
            <EditProfileDialog>
                <Button variant="gradient" className="w-full">
                    Edit profile
                </Button>
            </EditProfileDialog>
            {/* </Link> */}
        </div>
    );
}
