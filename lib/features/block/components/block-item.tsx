import { useUser } from "@/lib/hooks/use-user";

import { UserAvatar } from "@/components/user-avatar";

import { BlockButton } from "./block-button";

interface BlockProps {
    blocks: {
        id: string;
        username: string;
        imageUrl: string | null;
        status: boolean;
    }[];
}

export function BlockItem({ blocks }: BlockProps) {
    const handleNavigate = (userId: String) => {
        console.log("Navigate to user profile");
    };
    const { user } = useUser();

    return (
        <div className="divide-y divide-white/15">
            {blocks ? (
                blocks.map((block, index) => (
                    <div
                        className="flex items-center justify-between px-4 hover:bg-search"
                        key={index}
                    >
                        <button
                            onClick={() => handleNavigate(block.id)}
                            className="flex w-full items-center space-x-4 rounded-sm bg-transparent py-2"
                        >
                            <UserAvatar imageUrl={block?.imageUrl} />
                            <p className="w-auto truncate text-base">
                                {block.username}
                            </p>
                        </button>
                        <BlockButton blockedId={block.id} blockerId={user.id} />
                    </div>
                ))
            ) : (
                <p>No following</p>
            )}
        </div>
    );
}
