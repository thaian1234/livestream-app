import { UserAvatar } from "@/components/user-avatar";

interface RecommendProps {
    recommends: {
        id: string;
        username: string;
        imageUrl: string | null;
    }[];
}

export function Recommend({ recommends }: RecommendProps) {
    const handleNavigate = (liveId: String) => {
        // Navigate to the live page
    };
    return (
        <>
            {recommends.map((recommend, index) => (
                <button
                    onClick={() => handleNavigate(recommend.id)}
                    key={index}
                    className="flex w-full items-center justify-between rounded-sm bg-transparent py-2 pr-4 hover:bg-search"
                >
                    <div className="flex items-center space-x-4">
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
