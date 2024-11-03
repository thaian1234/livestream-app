import { Users } from "lucide-react";
import { useRouter } from "next/navigation";

import { FollowButton } from "@/lib/features/follow/components/follow-button";
import { useAuth } from "@/lib/providers/auth-provider";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/user-avatar";

interface UserPreviewCardProps {
    id: string;
    username: string;
    followers: number;
    imageUrl: string;
    isLive: boolean;
    isFollow: boolean;
}
export function UserPreviewCard({
    id,
    username,
    followers,
    imageUrl,
    isLive,
    isFollow
}: UserPreviewCardProps) {
    const router = useRouter();
    const { user } = useAuth();
    if (!user) return;

    return (
        <Card className="w-full overflow-hidden py-4 transition-all duration-300 ease-in-out hover:bg-accent/50 hover:shadow-lg">
            <CardContent className="px-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-grow items-center space-x-6">
                        <UserAvatar imageUrl={imageUrl} size="xl" />

                        <div className="min-w-0 flex-grow">
                            <div className="mb-2 flex items-center space-x-2">
                                <h3 className="line-clamp-1 text-lg font-semibold transition-colors duration-300 ease-in-out hover:text-primary">
                                    <a
                                        href={`/dashboard/${username}`}
                                        className="hover:underline"
                                    >
                                        {username}
                                    </a>
                                </h3>
                                {(isLive && <Badge className="bg-red-500 hover:bg-red-500 text-white">
                                    LIVE
                                </Badge>)}
                            </div>
                            <p className="mb-1 line-clamp-1 text-sm text-muted-foreground">
                                Category
                            </p>
                            <p className="mb-2 line-clamp-1 text-sm text-muted-foreground">
                                Category
                            </p>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Users className="mr-1 h-4 w-4" />
                                <span>{followers} Followers</span>
                            </div>
                        </div>
                    </div>
                    <FollowButton followingId={user.id} isFollowed={isFollow} />
                </div>
            </CardContent>
        </Card>
    );
}
