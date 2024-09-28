import Image from "next/image";

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
                        <Image
                            className="flex-shrink-0 rounded-full"
                            src={recommend.imageUrl || ""}
                            alt={recommend.username}
                            height={40}
                            width={40}
                        />
                        <div className="w-auto truncate text-base">
                            {recommend.username}
                        </div>
                    </div>
                </button>
            ))}
        </>
    );
}
