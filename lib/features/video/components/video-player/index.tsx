"use client";

import { Description } from "@radix-ui/react-dialog";
import { desc } from "drizzle-orm";
import {
    Heart,
    Maximize,
    MoreHorizontal,
    Pause,
    Play,
    Share2,
    ThumbsDown,
    ThumbsUp,
    Volume2,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ReactPlayer from "react-player";

import { FollowButton } from "@/lib/features/follow/components/follow-button";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

import { VideoThumbnail } from "@/components/thumbnail";
import { UserAvatar } from "@/components/user-avatar";

const dummyDataVideo = {
    userId: "1",
    isFollowing: false,
    title: "slow days, soft sounds — (music playlist for moments of peace)",
    description:
        "everything you need is already inside you — (a playlist for a quiet life) everything you need is already inside you — (a playlist for a quiet life) everything you need is already inside you — (a playlist for a quiet life) everything you need is already inside you — (a playlist for a quiet life) everything you need is already inside you — (a playlist for a quiet life)  ",
    views: "142K views",
    timeAgo: "4 months ago",
    duration: "31:19",
    thumbnail:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pinterest.com%2Fathuan611%2F%25E1%25BA%25A3nh-169%2F&psig=AOvVaw3n1uhLO7LOMaGooIgZLHx9&ust=1740549122864000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCIiBzfKQ3osDFQAAAAAdAAAAABAE",
};
export function VideoPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);

    return (
        <>
            {/* Video Player */}
            <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-900">
                <ReactPlayer
                    url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    controls // Hiển thị các nút điều khiển
                    width="100%"
                    height="100%"
                />
            </div>
            {/* Video Info */}
            <div className="mt-4">
                <h1 className="text-xl font-semibold">
                    {dummyDataVideo.description}
                </h1>
                <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <UserAvatar size={"lg"} />
                        <div className="mr-4">
                            <p>Living Out Loud</p>
                            <p className="flex space-x-6 text-sm text-white/70">
                                <span> Followers: 1000</span>
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
                            4.4K
                        </Button>
                        <Button variant="secondary" className="gap-2">
                            <ThumbsDown className="h-4 w-4" />
                        </Button>
                        <Button variant="secondary" className="gap-2">
                            <Share2 className="h-4 w-4" />
                            Share
                        </Button>
                        <Button variant="secondary" className="gap-2">
                            <Heart className="h-4 w-4" />
                            Save
                        </Button>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal />
                        </Button>
                    </div>
                </div>
                {/* Description */}
                <div className="mt-4 rounded-xl bg-gray-900/50 p-4">
                    <div className="flex gap-4 text-sm text-gray-400">
                        <span>231K views</span>
                        <span>4 months ago</span>
                        <span className="flex gap-2">
                            <Badge className="bg-gray-500 hover:bg-gray-600">
                                music
                            </Badge>
                            <Badge className="bg-gray-500 hover:bg-gray-600">
                                entertainment
                            </Badge>
                        </span>
                    </div>
                    <div
                        className={`mt-2 text-sm ${showFullDescription ? "" : "line-clamp-2"}`}
                    >
                        This playlist is a gentle reminder that tranquility and
                        strength come from within. Each track invites
                        reflection, encourages mindfulness, and nurtures your
                        spirit, creating a serene backdrop for quiet moments of
                        introspection.
                    </div>
                    <Button
                        variant="ghost"
                        className="mt-1 text-sm"
                        onClick={() =>
                            setShowFullDescription(!showFullDescription)
                        }
                    >
                        {showFullDescription ? "Show less" : "...more"}
                    </Button>
                </div>
            </div>
        </>
    );
}
