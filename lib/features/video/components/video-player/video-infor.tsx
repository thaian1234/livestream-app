"use client";

import { MoreHorizontal, Share2, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";

import { FollowButton } from "@/lib/features/follow/components/follow-button";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { TooltipModel } from "@/components/tooltip-model";
import { UserAvatar } from "@/components/user-avatar";

import { ISelectVideo } from ".";
import { OptionsDropdown } from "./options-dropdown";

export function VideoInfor({
    dummyDataVideo,
}: {
    dummyDataVideo: ISelectVideo;
}) {
    const [showFullDescription, setShowFullDescription] = useState(false);

    return (
        <div className="mt-4">
            <h1 className="line-clamp-2 text-xl font-semibold">
                {dummyDataVideo.title}
            </h1>
            <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <UserAvatar size={"lg"} />
                    <div className="mr-4">
                        <p>{dummyDataVideo.userName}</p>
                        <p className="flex space-x-6 text-sm text-white/70">
                            <span>Followers: {dummyDataVideo.followers}</span>
                        </p>
                    </div>
                    <FollowButton
                        followingId={dummyDataVideo.userId}
                        isFollowed={dummyDataVideo.isFollowing}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="secondary" className="gap-2">
                        <ThumbsUp className="h-4 w-4" />
                        {dummyDataVideo.likeCount}
                    </Button>
                    <Button variant="secondary" className="gap-2">
                        <ThumbsDown className="h-4 w-4" />
                        {dummyDataVideo.dislikeCount}
                    </Button>
                    <Button variant="secondary" className="gap-2">
                        <Share2 className="h-4 w-4" />
                        Share
                    </Button>
                    <OptionsDropdown>
                        <Button variant="ghost" className="px-2">
                            <TooltipModel content="Options" side="bottom">
                                <MoreHorizontal />
                            </TooltipModel>
                        </Button>
                    </OptionsDropdown>
                </div>
            </div>
            {/* Description */}
            <div className="mt-4 rounded-xl bg-secondary/80 p-4">
                <div className="flex gap-4 text-sm text-gray-400">
                    <span>{dummyDataVideo.viewCount} views</span>
                    <span>{dummyDataVideo.createdAt}</span>
                    <span className="flex gap-2">
                        {dummyDataVideo.categories.map((category) => (
                            <Badge
                                key={category}
                                className="bg-gray-500 hover:bg-gray-600"
                            >
                                {category}
                            </Badge>
                        ))}
                    </span>
                </div>
                <div
                    className={`mt-2 text-sm ${showFullDescription ? "" : "line-clamp-2"}`}
                >
                    {dummyDataVideo.description}
                </div>
                <Button
                    variant="link"
                    className="mt-1 px-0 text-sm text-teal-2"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                >
                    {showFullDescription ? "Show less" : "Show more"}
                </Button>
            </div>
        </div>
    );
}
