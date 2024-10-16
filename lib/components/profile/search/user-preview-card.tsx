import Image from "next/image";
import { useRouter } from "next/navigation";

import { FollowButton } from "@/lib/features/follow/components/follow-button";
import { useAuth } from "@/lib/providers/auth-provider";

interface UserPreviewCardProps {
    id: string;
    username: string;
    followers: number;
    imageUrl: string;
}
export function UserPreviewCard({
    id,
    username,
    followers,
    imageUrl,
}: UserPreviewCardProps) {
    const router = useRouter();
    const { user } = useAuth();
    if (!user) return;
    const navigateUserProfile = () => {
        //navigate to user profile
    };
    return (
        <div className="mr-10 flex justify-between space-x-4">
            <div className="flex space-x-4">
                <div className="flex min-w-72 justify-center">
                    <button onClick={navigateUserProfile}>
                        <Image
                            className="rounded-full object-cover"
                            src={imageUrl || "/user.svg"}
                            alt={username}
                            height={120}
                            width={120}
                        />
                    </button>
                </div>
                <p className="flex flex-col space-y-1">
                    <p className="text-xl">{username}</p>
                    <p className="text-sm text-white/70">
                        Followers: {followers}
                    </p>
                </p>
            </div>
            <div>
                <FollowButton followerId={user.id} followingId={id} />
            </div>
        </div>
    );
}
