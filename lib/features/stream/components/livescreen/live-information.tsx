import Link from "next/link";

import { ROUTES } from "@/lib/configs/routes.config";
import { donationApi } from "@/lib/features/donation/apis";
import { FollowButton } from "@/lib/features/follow/components/follow-button";

import { StreamDTO } from "@/server/api/dtos/stream.dto";
import { UserDTO } from "@/server/api/dtos/user.dto";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { UserAvatar } from "@/components/user-avatar";

import { streamApi } from "../../apis";
import { MoreActionPopover } from "./more-action-popover";

interface LiveInformationProps {
    stream: StreamDTO.Select;
    user: UserDTO.Select;
    followerCount: number;
    isFollowing: boolean;
    isOwnedStream: boolean;
}

export function LiveInformation({
    stream,
    user,
    followerCount,
    isFollowing,
    isOwnedStream,
}: LiveInformationProps) {
    const { data } = streamApi.query.useGetStreamCategories(stream.id);
    const categories = data?.data;

    return (
        <div className="mt-2 flex h-fit flex-1 flex-row flex-wrap justify-between gap-4 overflow-hidden px-2">
            <Link
                href={ROUTES.ABOUT_PAGE(user.username)}
                className="space-y-1 truncate text-white"
            >
                <div className="truncate text-xl">{stream.name}</div>
                <div className="flex w-full items-center space-x-2">
                    <UserAvatar
                        imageUrl={user.imageUrl}
                        isLive={stream.isLive}
                        size={"lg"}
                    />
                    <div className="flex flex-col space-y-1">
                        <div className="text-sm">{user.username}</div>
                        <div className="flex space-x-6 text-sm text-white/70">
                            <span> Followers: {followerCount}</span>
                        </div>
                        {categories && (
                            <div className="flex w-full space-x-1 overflow-x-hidden">
                                {categories?.map((category) => {
                                    return (
                                        <Badge
                                            key={category.categoryId}
                                            className="bg-gray-500 hover:bg-gray-600"
                                        >
                                            {category.category.name}
                                        </Badge>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </Link>
            {!isOwnedStream && (
                <div className="flex space-x-4">
                    <FollowButton
                        followingId={user.id}
                        isFollowed={isFollowing}
                    />
                    <MoreActionPopover streamer={user} />
                </div>
            )}
        </div>
    );
}
