import {
    CircleSlash2,
    Forward,
    MoreHorizontal,
    UsersRound,
} from "lucide-react";

import { BlockButton } from "@/lib/features/block/components/block-button";
import { FollowButton } from "@/lib/features/follow/components/follow-button";
import { useUser } from "@/lib/hooks/use-user";

import { StreamDTO } from "@/server/api/dtos/stream.dto";
import { UserDTO } from "@/server/api/dtos/user.dto";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { UserAvatar } from "@/components/user-avatar";

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
}: LiveInformationProps) {
    return (
        <div className="mt-2 flex justify-between px-2">
            <div className="w-full space-y-1 truncate text-white">
                <div className="text-xl">{stream.name}</div>

                <div className="flex w-full items-center space-x-2">
                    <UserAvatar
                        imageUrl={user.imageUrl}
                        isLive={stream.isLive}
                        size={"lg"}
                    />
                    <div>
                        <div className="text-sm">{user.username}</div>
                        <div className="flex space-x-6 text-sm text-white/70">
                            <span> Followers: {followerCount}</span>
                            <span className="flex space-x-1">
                                <UsersRound size={16} />
                                <span className="text-sm">{"100"}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-x-2"></div>

            <div className="mr-2">
                <FollowButton followingId={user.id} isFollowed={isFollowing} />
            </div>

            <MoreActionPopover streamer={user} />
        </div>
    );
}
