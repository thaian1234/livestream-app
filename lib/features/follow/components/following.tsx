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
                        className="bg-transparent hover:bg-gradient-to-r hover:from-transparent hover:via-search hover:to-transparent"
                    >
                        <div className="flex items-center space-x-2">
                            <UserAvatar imageUrl={following?.imageUrl} />
                            <p className="w-auto truncate text-base">
                                {following.username}
                            </p>
                        </div>
                    </button>
                ))
            ) : (
                <p>No following</p>
            )}
        </div>
    );
}
