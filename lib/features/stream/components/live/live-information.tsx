import { Forward, Heart, UsersRound } from "lucide-react";

import { FollowButton } from "@/lib/features/follow/components/follow-button";
import { useLiveInfor } from "@/lib/stores/store-live-infor";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function LiveInformation() {
    const { infor, setViewer } = useLiveInfor();
    return (
        <div className="mt-2 flex justify-between">
            <div className="w-full space-y-1 truncate text-white">
                <div className="text-xl">{infor.title}</div>

                <div className="flex w-full items-start space-x-2">
                    <button>
                        <Avatar className="h-10 w-10">
                            <AvatarImage
                                src={infor.avatar}
                                alt={infor.userName}
                            />
                            <AvatarFallback />
                        </Avatar>
                    </button>
                    <div>
                        <div className="text-sm">{infor.userName}</div>
                        <div className="flex space-x-6 text-sm text-white/70">
                            <span> Followers: {infor.followers}</span>
                            <span className="flex space-x-1">
                                <UsersRound size={16} />
                                <span className="text-sm">{infor.viewers}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-x-2"></div>

            <FollowButton followerId="" followingId="" />

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
