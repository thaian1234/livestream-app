import { useRouter } from "next/navigation";

import { ROUTES } from "@/lib/configs/routes.config";
import { ImageUrlType } from "@/lib/types";

import { UserAvatar } from "@/components/user-avatar";

interface FollowingProps {
    followings: {
        id: string;
        username: string;
        imageUrl?: ImageUrlType;
    }[];
}

export function Following({ followings }: FollowingProps) {
    const router = useRouter();
    const handleNavigate = (username: string) => {
        router.push(ROUTES.STREAM_PAGE(username));
    };
    return (
        <div>
            {followings ? (
                followings.map((following, index) => (
                    <button
                        onClick={() => handleNavigate(following.username)}
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
