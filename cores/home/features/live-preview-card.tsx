import Image from "next/image";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardCardProps {
    title: string;
    userName: string;
    category?: string;
    thumnail: string;
    viewers: string;
    // Add more props if needed...
}

export default function LivePreviewCard({
    title,
    userName,
    category,
    thumnail,
    viewers,
}: DashboardCardProps) {
    return (
        //khung ảnh 16:9, khung Card 5:4
        <AspectRatio ratio={5 / 4} className="overflow-y-hidden">
            <div className="h-full w-full bg-gray-1 font-sans text-black-0">
                {/* thumnail */}
                <AspectRatio
                    ratio={16 / 9}
                    className="bg-black-0"
                ></AspectRatio>
                <div className="flex items-center space-x-6">
                    <Image
                        className="rounded-full object-cover"
                        src={thumnail}
                        alt={title}
                        height={50}
                        width={50}
                    />
                    <div>
                        <div className="truncate text-xl text-white">
                            {title}
                        </div>
                        <div className="truncate text-sm text-white">
                            {userName}
                        </div>
                        <div className="flex justify-between text-xl text-white">
                            <div className="mr-1 flex space-x-1 truncate">
                                <Badge>{category}</Badge>
                                <Badge>{category}</Badge>
                            </div>
                            <div></div>
                        </div>
                    </div>
                </div>
                {/* <CardContent>
                    <p className="text-2xl font-bold">{userName}</p>
                    <CardTitle className="w-full truncate text-sm">
                        {category}
                    </CardTitle>
                </CardContent> */}
            </div>
        </AspectRatio>
    );
}
