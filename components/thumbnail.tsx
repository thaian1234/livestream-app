"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";

import { AspectRatio } from "./ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface VideoThumbnailProps {
    thumbnailUrl: string | null;
    priority?: boolean;
    sizes?: string;
    alt?: string;
    placeholder?: "blur" | "empty";
}

export function VideoThumbnail({
    thumbnailUrl,
    priority = false,
    sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    alt = "Video thumbnail",
    placeholder = "empty",
}: VideoThumbnailProps) {
    return (
        <AspectRatio ratio={16 / 9} className="group relative">
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 transition-all duration-300 group-hover:shadow-lg">
                {!thumbnailUrl ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Avatar className="size-14">
                            <AvatarImage src="/circle-play.svg" />
                            <AvatarFallback />
                        </Avatar>
                    </div>
                ) : (
                    <div className="relative h-full w-full">
                        <Image
                            src={thumbnailUrl}
                            alt={alt}
                            fill
                            priority={priority}
                            sizes={sizes}
                            quality={85}
                            placeholder="empty"
                            className={cn(
                                "rounded-lg object-cover transition-opacity duration-300",
                                "bg-gradient-to-br from-gray-700 to-gray-900",
                            )}
                        />
                    </div>
                )}
            </div>
        </AspectRatio>
    );
}
