"use client";

import { UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/lib/configs/routes.config";
import { useLiveInfor } from "@/lib/stores/store-live-infor";

import { StreamDTO } from "@/server/api/dtos/stream.dto";

import { VideoThumbnail } from "@/components/thumbnail";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/user-avatar";

interface DashboardCardProps extends StreamDTO.StreamWithUser {}

export function LivePreviewCard({
    id,
    isLive,
    name,
    thumbnailUrl,
    userId,
    user,
    categories,
}: DashboardCardProps) {
    const router = useRouter();

    const handleRedirect = () => {
        router.push(ROUTES.STREAM_PAGE(user.username));
    };

    return (
        //khung ảnh 16:9, khung Card 5:4
        <AspectRatio
            ratio={5 / 4}
            className="min-h-72 cursor-pointer overflow-y-hidden"
            onClick={handleRedirect}
        >
            <div className="h-full w-full font-sans">
                {/* thumnail */}
                <VideoThumbnail
                    avatarUrl={user.imageUrl}
                    thumbnailUrl={thumbnailUrl}
                />
                <div className="flex items-center space-x-4 px-2">
                    <UserAvatar
                        imageUrl={user.imageUrl}
                        isLive={isLive}
                        size={"lg"}
                    />
                    <div className="w-full truncate text-white">
                        <p className="truncate text-lg">{name}</p>
                        <p className="truncate text-sm">{user.username}</p>
                        <div className="flex justify-between py-1">
                            <div className="flex w-full space-x-1 overflow-x-hidden">
                                {categories.map((category) => {
                                    return (
                                        <Badge
                                            key={category.id}
                                            className="bg-gray-500 hover:bg-gray-600"
                                        >
                                            {category.name}
                                        </Badge>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AspectRatio>
    );
}
