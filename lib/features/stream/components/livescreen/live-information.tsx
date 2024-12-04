import { Forward, UsersRound } from "lucide-react";

import { BlockButton } from "@/lib/features/block/components/block-button";
import { FollowButton } from "@/lib/features/follow/components/follow-button";
import { useUser } from "@/lib/hooks/use-user";

import { StreamDTO } from "@/server/api/dtos/stream.dto";
import { UserDTO } from "@/server/api/dtos/user.dto";

import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";

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
    const currentUser = useUser();
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

            {currentUser.user.id !== user.id && (
                <div className="mr-2">
                    <BlockButton blockedId={user.id} isBlock={false} />
                </div>
            )}

            <FollowButton followingId={user.id} isFollowed={isFollowing} />

            <Button
                size="sm"
                className="ml-2 rounded-xl bg-white/10 text-white"
            >
                <Forward className="mr-1" />
                Share
            </Button>
        </div>
    );
}
