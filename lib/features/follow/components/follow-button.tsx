"use client";

import { followApi } from "../apis";
import { UserCheck, UserMinus, UserPlus } from "lucide-react";
import { useState } from "react";
import React from "react";
import { toast } from "sonner";

import { useAuth } from "@/lib/providers/auth-provider";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface FollowButtonProps {
    followingId: string;
    isFollowed: boolean;
}

export function FollowButton({ followingId, isFollowed }: FollowButtonProps) {
    const { user: currentUser } = useAuth();
    const [isFollowing, setIsFollowing] = useState<Boolean>(isFollowed);
    const [isHovering, setIsHovering] = useState<Boolean>(false);
    const { mutate: handleFollowToggle, isPending } =
        followApi.mutation.useFollowToggle();

    const handleClick = () => {
        if (!currentUser) {
            toast.error("Please Sign in for further action");
            return;
        }
        handleFollowToggle(
            {
                param: { followingId },
            },
            {
                onSuccess: () => {
                    setIsFollowing(!isFollowing);
                },
                onError: () => {
                    setIsHovering(isFollowed);
                },
            },
        );
    };

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        onClick={handleClick}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        disabled={isPending}
                        className="group relative flex h-10 w-32 items-center justify-center overflow-hidden bg-black-0 px-4 transition-all duration-300 ease-in-out hover:bg-black-0/80"
                    >
                        <div
                            className={cn(
                                "absolute inset-0 flex items-center justify-center space-x-2 transition-all duration-300 ease-in-out",
                                isFollowing
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-full opacity-0",
                            )}
                        >
                            {isHovering ? (
                                <>
                                    <UserMinus className="h-6 w-6 fill-red-500 text-red-500 transition-all duration-300 ease-in-out" />
                                    <span className="fill-red-500 text-red-500 transition-all duration-300 ease-in-out">
                                        Unfollow
                                    </span>
                                </>
                            ) : (
                                <>
                                    <UserCheck className="h-6 w-6 fill-primary text-primary transition-all duration-300 ease-in-out" />
                                    <span className="transition-all duration-300 ease-in-out">
                                        Followed
                                    </span>
                                </>
                            )}
                        </div>
                        <div
                            className={cn(
                                "absolute inset-0 flex items-center justify-center space-x-2 transition-all duration-300 ease-in-out",
                                isFollowing
                                    ? "-translate-y-full opacity-0"
                                    : "translate-y-0 opacity-100",
                            )}
                        >
                            <UserPlus
                                className={`h-5 w-5 text-primary transition-all duration-300 ease-in-out group-hover:scale-125 group-hover:fill-primary group-hover:text-primary`}
                            />
                            <span className="transition-all duration-300 ease-in-out">
                                Follow
                            </span>
                        </div>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{isFollowing ? "Unfollow" : "Follow"}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
