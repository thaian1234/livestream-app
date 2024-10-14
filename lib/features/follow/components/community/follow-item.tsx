import { FollowButton } from "../follow-button";

import { useUser } from "@/lib/hooks/use-user";

import { UserAvatar } from "@/components/user-avatar";

interface FollowingProps {
    followings: {
        id: string;
        username: string;
        imageUrl: string | null;
    }[];
}

export function FollowItem({ followings }: FollowingProps) {
    const { user } = useUser();

    const handleNavigate = (userId: String) => {
        console.log("Navigate to user profile");
    };
    return (
        <div className="divide-y divide-white/15">
            {followings ? (
                followings.map((following, index) => (
                    <div
                        className="flex items-center justify-between px-4 hover:bg-search"
                        key={index}
                    >
                        <button
                            onClick={() => handleNavigate(following.id)}
                            className="flex w-full items-center space-x-4 rounded-sm bg-transparent py-2"
                        >
                            <UserAvatar imageUrl={following?.imageUrl} />
                            <p className="w-auto truncate text-base">
                                {following.username}
                            </p>
                        </button>
                        <FollowButton
                            followerId={following.id}
                            followingId={user.id}
                        />
                    </div>
                ))
            ) : (
                <p>No following</p>
            )}
        </div>
    );
}
