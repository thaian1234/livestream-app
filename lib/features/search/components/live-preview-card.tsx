import { useRouter } from "next/navigation";

import { ROUTES } from "@/lib/configs/routes.config";

import { CategoryDTO } from "@/server/api/dtos/category.dto";

import { VideoThumbnail } from "@/components/thumbnail";
import { Badge } from "@/components/ui/badge";

interface LivePreviewCardProps {
    id: string;
    title: string;
    userName: string;
    categories: CategoryDTO.BasicSelect[];
    thumbnail: string | null;
    viewers: string;
    avatar: string;
}
export function LivePreviewCard({
    id,
    title,
    userName,
    categories,
    thumbnail,
    avatar,
}: LivePreviewCardProps) {
    const router = useRouter();

    const handleNavigateLive = () => {
        router.push(ROUTES.STREAM_PAGE(userName));
    };

    return (
        <div
            className="flex cursor-pointer space-x-4"
            onClick={handleNavigateLive}
        >
            <div className="w-72">
                <VideoThumbnail avatarUrl={avatar} thumbnailUrl={thumbnail} />
            </div>
            <div className="flex flex-col space-y-1">
                <p className="text-xl">{title}</p>
                <p className="text-sm text-white/70">{userName}</p>
                {categories.length > 0 && (
                    <div className="flex">
                        <div className="flex space-x-2 overflow-x-hidden">
                            {categories.map((category) => (
                                <Badge
                                    className="bg-gray-500 hover:bg-gray-600"
                                    key={category.id}
                                >
                                    {category.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
