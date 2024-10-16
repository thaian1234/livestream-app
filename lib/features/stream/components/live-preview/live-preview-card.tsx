"use client";

import { UsersRound } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useLiveInfor } from "@/lib/stores/store-live-infor";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";

interface LivePreviewCardProps {
    id: string;
    title: string;
    userName: string;
    category?: string;
    thumnail: string;
    viewers: string;
    avatar: string;
    // Add more props if needed...
}

export function LivePreviewCard({
    id,
    title,
    userName,
    category,
    thumnail,
    viewers,
    avatar,
}: LivePreviewCardProps) {
    const { setLiveInfor } = useLiveInfor();
    const router = useRouter();

    const handleNavigateLive = () => {
        // Navigate to live room
        router.push(`/live/${userName.replace(/\s+/g, "-")}`);
        // get one API and setLiveInfor
        setLiveInfor({
            id,
            title,
            userName,
            category,
            viewers,
            avatar,
            followers: "122000",
        });
    };
    return (
        //khung ảnh 16:9, khung Card 5:4
        <AspectRatio ratio={5 / 4} className="overflow-y-hidden">
            <div className="h-full w-full font-sans">
                {/* thumnail */}
                <AspectRatio
                    onClick={handleNavigateLive}
                    ratio={16 / 9}
                    className="cursor-pointer rounded-xl bg-gray-1"
                ></AspectRatio>
                <div className="flex items-center">
                    <Image
                        className="mx-2 rounded-full object-cover"
                        src={thumnail}
                        alt={title}
                        height={60}
                        width={60}
                    />
                    <div className="w-full truncate text-white">
                        <div className="text-lg">{title}</div>
                        <div className="text-sm">{userName}</div>
                        <div className="flex justify-between py-1">
                            <div className="flex w-2/3 space-x-2 overflow-x-hidden">
                                <Badge className="bg-gray-500 hover:bg-gray-600">
                                    {category}
                                </Badge>
                                <Badge className="bg-gray-500 hover:bg-gray-600">
                                    {category}
                                </Badge>
                            </div>
                            <div className="flex space-x-1">
                                <UsersRound size={16} />
                                <span className="text-sm">{viewers}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AspectRatio>
    );
}
