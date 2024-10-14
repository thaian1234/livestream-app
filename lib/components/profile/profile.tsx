"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/providers/auth-provider";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import ProfileSkeleton from "./profile-skeleton";

const userData = {
    followers: 1000,
    following: 500,
    blocking: 12,
};
export function Profile() {
    const { user, isPending: isPending, error } = useAuth();
    const router = useRouter();
    if (isPending || !user) {
        return <ProfileSkeleton />;
    }
    const handleEditProfile = () => {
        router.push(`/dashboard/${user.username}/profile`);
    };

    return (
        <div className="flex w-[350px] flex-col items-center space-y-4">
            <button className="">
                <Image
                    className="rounded-full object-cover"
                    src={user.imageUrl || "/user.svg"}
                    alt={user.username}
                    height={150}
                    width={150}
                />
            </button>
            <p className="max-w-full break-words text-2xl">{user.username}</p>
            <div className="flex w-full justify-around">
                <Link
                    href={`/dashboard/${user.username}/community`}
                    className="hover:underline"
                >
                    <span className="font-light text-white/50">
                        Followers:{" "}
                    </span>
                    <span>{userData.followers}</span>
                </Link>
                <Link
                    href={`/dashboard/${user.username}/community`}
                    className="hover:underline"
                >
                    <span className="font-light text-white/50">
                        Following:{" "}
                    </span>
                    <span>{userData.following}</span>
                </Link>
            </div>
            <div className="max-w-full break-words font-extralight text-white/70">
                {user.bio}
            </div>
            <Button
                variant="gradient"
                className="w-full"
                onClick={handleEditProfile}
            >
                Edit profile
            </Button>
        </div>
    );
}
