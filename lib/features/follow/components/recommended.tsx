import { useRouter } from "next/navigation";

import { ROUTES } from "@/lib/configs/routes.config";
import { ImageUrlType } from "@/lib/types";

import { UserAvatar } from "@/components/user-avatar";

interface RecommendProps {
    recommends: {
        id: string;
        username: string;
        imageUrl?: ImageUrlType;
    }[];
}

export function Recommend({ recommends }: RecommendProps) {
    const router = useRouter();
    const handleNavigate = (username: string) => {
        router.push(ROUTES.STREAM_PAGE(username));
    };
    return (
        <>
            {recommends.map((recommend, index) => (
                <button
                    onClick={() => handleNavigate(recommend.username)}
                    key={index}
                    className="bg-transparent hover:bg-gradient-to-r hover:from-transparent hover:via-search hover:to-transparent"
                >
                    <div className="flex items-center space-x-2">
                        <UserAvatar imageUrl={recommend.imageUrl} />
                        <p className="w-auto truncate text-base">
                            {recommend.username}
                        </p>
                    </div>
                </button>
            ))}
        </>
    );
}
