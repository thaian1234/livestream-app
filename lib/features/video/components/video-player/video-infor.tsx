"use client";

import { MoreHorizontal, Share2, ThumbsDown, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { FollowButton } from "@/lib/features/follow/components/follow-button";
import { useUser } from "@/lib/hooks/use-user";

import { VideoDTO } from "@/server/api/dtos/video.dto";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { TooltipModel } from "@/components/tooltip-model";
import { UserAvatar } from "@/components/user-avatar";

import { ISelectVideo } from ".";
import { videoApi } from "../../apis";
import { OptionsDropdown } from "./options-dropdown";

interface VideoInforProps extends VideoDTO.VideoWithUser {
    followers: number;
    isFollowing: boolean;
    isBlocked: boolean;
}

export function VideoInfor({ videoData }: { videoData: VideoInforProps }) {
    const currentUser = useUser();
    const [showFullDescription, setShowFullDescription] = useState(false);
    const router = useRouter();
    const {
        mutate: handleUpdate,
        isPending,
        error,
    } = videoApi.mutation.useUpdateVideo();
    const handleLikeButton = () => {
        handleUpdate({
            param: {
                id: videoData.id,
            },
            json: {
                likeCount: videoData.likeCount + 1,
            },
        });
    };
    const handleDislikeButton = () => {
        handleUpdate({
            param: {
                id: videoData.id,
            },
            json: {
                dislikeCount: videoData.dislikeCount + 1,
            },
        });
    };

    const [isOverflowing, setIsOverflowing] = useState(false);
    const textRef = useRef<HTMLParagraphElement>(null);
    useEffect(() => {
        if (textRef.current) {
            const lineHeight = parseFloat(
                getComputedStyle(textRef.current).lineHeight,
            );
            const maxHeight = lineHeight * 42; // Tối đa 2 dòng
            setIsOverflowing(textRef.current.scrollHeight > maxHeight);
        }
    }, [videoData.description]);

    return (
        <div className="mt-4">
            <h1 className="line-clamp-2 text-xl font-semibold">
                {videoData.title}
            </h1>
            <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <UserAvatar size={"lg"} />
                    <div className="mr-4">
                        <p>{videoData.user.username}</p>
                        <p className="flex space-x-6 text-sm text-white/70">
                            <span>Followers: {videoData.followers}</span>
                        </p>
                    </div>
                    {currentUser.user.id === videoData.userId ? (
                        <FollowButton
                            followingId={videoData.userId}
                            isFollowed={videoData.isFollowing}
                        />
                    ) : (
                        <Button
                            variant="secondary"
                            onClick={() => {
                                router.push(`video/${videoData.id}/edit`);
                            }}
                        >
                            Edit Video
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        className="gap-2"
                        onClick={handleLikeButton}
                        loading={isPending}
                    >
                        <ThumbsUp className="h-4 w-4" />
                        {videoData.likeCount}
                    </Button>
                    <Button
                        variant="secondary"
                        className="gap-2"
                        onClick={handleDislikeButton}
                        loading={isPending}
                    >
                        <ThumbsDown className="h-4 w-4" />
                        {videoData.dislikeCount}
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
                    <span>{videoData.viewCount} views</span>
                    <span>{videoData.createdAt}</span>
                    <span className="flex gap-2">
                        {videoData.categories.map((category) => (
                            <Badge
                                key={category.id}
                                className="bg-gray-500 hover:bg-gray-600"
                            >
                                {category.name}
                            </Badge>
                        ))}
                    </span>
                </div>
                <div
                    ref={textRef}
                    className={`mt-2 text-sm ${showFullDescription ? "" : "line-clamp-2"}`}
                >
                    {videoData.description}
                </div>
                {isOverflowing && (
                    <Button
                        variant="link"
                        className="mt-1 px-0 text-sm text-teal-2"
                        onClick={() =>
                            setShowFullDescription(!showFullDescription)
                        }
                    >
                        {showFullDescription ? "Show less" : "Show more"}
                    </Button>
                )}
            </div>
        </div>
    );
}
