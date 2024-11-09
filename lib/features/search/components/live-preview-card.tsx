import { useRouter } from "next/navigation";

import { useLiveInfor } from "@/lib/stores/store-live-infor";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";

interface LivePreviewCardProps {
    id: string;
    title: string;
    userName: string;
    category?: string;
    thumbnail: string;
    viewers: string;
    avatar: string;
}
export function LivePreviewCard({
    id,
    title,
    userName,
    category,
    thumbnail,
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
        <div className="flex space-x-4">
            <div className="w-72">
                <AspectRatio
                    onClick={handleNavigateLive}
                    ratio={16 / 9}
                    className="cursor-pointer rounded-xl bg-gray-1"
                ></AspectRatio>
            </div>
            <div className="flex flex-col space-y-1">
                <a
                    className="cursor-pointer text-xl hover:underline"
                    href={`/username`}
                >
                    {title}
                </a>
                <a
                    className="cursor-pointer text-sm text-white/70 hover:underline"
                    href={`/dashboard/username`}
                >
                    {userName}
                </a>
                <p className="text-sm text-white/70">{viewers} Viewers</p>
                <div className="flex">
                    <div className="flex space-x-2 overflow-x-hidden">
                        <Badge className="bg-gray-500 hover:bg-gray-600">
                            {category}
                        </Badge>
                        <Badge className="bg-gray-500 hover:bg-gray-600">
                            {category}
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    );
}
