import { UsersRound } from "lucide-react";
import Image from "next/image";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";

interface DashboardCardProps {
    title: string;
    userName: string;
    category?: string;
    thumnail: string;
    viewers: string;
    avatar: string;
    // Add more props if needed...
}

export default function LivePreviewCard({
    title,
    userName,
    category,
    thumnail,
    viewers,
    avatar,
}: DashboardCardProps) {
    return (
        //khung ảnh 16:9, khung Card 5:4
        <AspectRatio ratio={5 / 4} className="overflow-y-hidden">
            <div className="bg-black-3 h-full w-full font-sans text-black-0">
                {/* thumnail */}
                <AspectRatio
                    ratio={16 / 9}
                    className="rounded-xl bg-gray-1"
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
