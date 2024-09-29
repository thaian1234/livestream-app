"use client";

import { followApi } from "../apis";
import { UserCheck, UserMinus, UserPlus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

interface FollowButtonProps {
    followerId: string;
    followingId: string;
}

export function FollowButton({ followerId, followingId }: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const { mutate: handleFollowToggle, isPending } =
        followApi.mutation.useFollowToggle();
    const handleClick = () => {
        setIsFollowing(!isFollowing);
        handleFollowToggle({ param: { followerId, followingId } });
    };

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    return (
        <Button
            variant="outline"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            disabled={isPending}
            className={`group relative h-10 overflow-hidden transition-all duration-300 ease-in-out hover:bg-primary-foreground/90 ${isFollowing ? "w-12 bg-primary-foreground" : "w-28 px-4"} flex items-center justify-center`}
        >
            <div
                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${isFollowing ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"} `}
            >
                {isHovering ? (
                    <UserMinus
                        className={`h-6 w-6 fill-red-500 text-red-500 transition-all duration-300 ease-in-out`}
                    />
                ) : (
                    <UserCheck
                        className={`h-6 w-6 fill-primary text-primary transition-all duration-300 ease-in-out`}
                    />
                )}
            </div>
            <div
                className={`absolute inset-0 flex items-center justify-center space-x-2 transition-all duration-300 ease-in-out ${isFollowing ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"} `}
            >
                <UserPlus
                    className={`h-5 w-5 text-primary transition-all duration-300 ease-in-out group-hover:scale-125 group-hover:fill-primary group-hover:text-primary`}
                />
                <span className="transition-all duration-300 ease-in-out">
                    Follow
                </span>
            </div>
        </Button>
    );
}
