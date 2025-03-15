"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { AspectRatio } from "./ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserAvatar } from "./user-avatar";

interface VideoThumbnailProps {
    thumbnailUrl: string | null;
}

export function VideoThumbnail({ thumbnailUrl }: VideoThumbnailProps) {
    const [thumbnailError, setThumbnailError] = useState(!thumbnailUrl);

    return (
        <AspectRatio ratio={16 / 9} className="group relative">
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-600 transition-all duration-300 group-hover:shadow-lg">
                {thumbnailError ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Avatar className="size-14">
                            <AvatarImage src={"/circle-play.svg"} />
                            <AvatarFallback />
                        </Avatar>
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
