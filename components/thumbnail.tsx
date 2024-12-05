import Image from "next/image";
import { useState } from "react";

import { AspectRatio } from "./ui/aspect-ratio";
import { UserAvatar } from "./user-avatar";

interface VideoThumbnailProps {
    thumbnailUrl: string | null;
    avatarUrl: string | null;
}

export function VideoThumbnail({
    thumbnailUrl,
    avatarUrl,
}: VideoThumbnailProps) {
    const [thumbnailError, setThumbnailError] = useState(!thumbnailUrl);

    return (
        <AspectRatio ratio={16 / 9} className="group relative">
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-600 transition-all duration-300 group-hover:shadow-lg">
                {thumbnailError ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <UserAvatar
                            imageUrl={avatarUrl}
                            isLive={false}
                            size={"lg"}
                        />
                    </div>
                ) : (
                    <Image
                        src={thumbnailUrl || ""}
                        alt={"thumbnail"}
                        objectFit="object-cover"
                        fill
                        className="overflow-hidden rounded-lg"
                        onError={() => setThumbnailError(true)}
                    />
                )}
            </div>
        </AspectRatio>
    );
}
