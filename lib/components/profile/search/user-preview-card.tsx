import { Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMediaQuery, useScreen } from "usehooks-ts";

import { ROUTES } from "@/lib/configs/routes.config";
import { FollowButton } from "@/lib/features/follow/components/follow-button";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/user-avatar";

interface UserPreviewCardProps {
    id: string;
    username: string;
    followers: number;
    imageUrl: string | null;
    isLive: boolean;
    isFollow: boolean;
}
export function UserPreviewCard({
    id,
    username,
    followers,
    imageUrl,
    isLive,
    isFollow,
}: UserPreviewCardProps) {
    const router = useRouter();
    const desktopScreen = useMediaQuery("(min-width: 1280px)");

    const handleNavigateLive = () => {
        router.push(ROUTES.STREAM_PAGE(username));
    };
    return (
        <Card className="w-full overflow-hidden py-4 transition-all duration-300 ease-in-out hover:bg-accent/50 hover:shadow-lg">
            <CardContent className="px-6">
                <div className="flex cursor-pointer items-center justify-between">
                    <div
                        className="flex flex-grow items-center space-x-6"
                        onClick={handleNavigateLive}
                    >
                        <UserAvatar imageUrl={imageUrl} size="xl" />
                        <div className="min-w-0 flex-grow">
                            <div className="mb-2 flex items-center space-x-2">
                                <h3 className="line-clamp-1 text-lg font-semibold transition-colors duration-300 ease-in-out hover:text-primary hover:underline">
                                    {username}
                                </h3>
                                {isLive && (
                                    <Badge className="bg-red-500 text-white hover:bg-red-500">
                                        LIVE
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Users className="mr-1 h-4 w-4" />
                                <span>{followers} Followers</span>
                            </div>
                            {!desktopScreen && (
                                <div className="mt-2">
                                    <FollowButton
                                        followingId={id}
                                        isFollowed={isFollow}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    {desktopScreen && (
                        <FollowButton followingId={id} isFollowed={isFollow} />
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
