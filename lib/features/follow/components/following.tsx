import { UserAvatar } from "@/components/user-avatar";

interface FollowingProps {
    followings: {
        id: string;
        username: string;
        imageUrl: string | null;
    }[];
}

export function Following({ followings }: FollowingProps) {
    const handleNavigate = (userId: String) => {
        console.log("Navigate to user profile");
    };
    return (
        <div>
            {followings ? (
                followings.map((following, index) => (
                    <button
                        onClick={() => handleNavigate(following.id)}
                        key={index}
                        className="flex w-full items-center space-x-4 rounded-sm bg-transparent py-2 pr-4 hover:bg-search"
                    >
                        <UserAvatar imageUrl={following?.imageUrl} />
                        <p className="w-auto truncate text-base">
                            {following.username}
                        </p>
                    </button>
                ))
            ) : (
                <p>No following</p>
            )}
        </div>
    );
}
