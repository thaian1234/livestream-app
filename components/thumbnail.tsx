"use client";

import Image from "next/image";
import { useState } from "react";

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
    const [thumbnailError, setThumbnailError] = useState(!thumbnailUrl);

    return (
        <AspectRatio ratio={16 / 9} className="group relative">
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 transition-all duration-300 group-hover:shadow-lg">
                {thumbnailError ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Avatar className="size-14">
                            <AvatarImage src="/circle-play.svg" />
                            <AvatarFallback />
                        </Avatar>
                    </div>
                ) : (
                    <>
                        <Image
                            src={thumbnailUrl || ""}
                            alt={alt}
                            fill
                            priority={priority}
                            sizes={sizes}
                            quality={85}
                            placeholder={"empty"}
                            className={cn(
                                "rounded-lg object-cover transition-opacity duration-300",
                            )}
                            onError={() => {
                                setThumbnailError(true);
                            }}
                        />
                    </>
                )}
            </div>
        </AspectRatio>
    );
}
