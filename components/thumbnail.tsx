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
    blurDataURL?: string;
}

export function VideoThumbnail({
    thumbnailUrl,
    priority = false,
    sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    alt = "Video thumbnail",
    placeholder = "empty",
    blurDataURL,
}: VideoThumbnailProps) {
    const [thumbnailError, setThumbnailError] = useState(!thumbnailUrl);
    const [imageLoading, setImageLoading] = useState(true);

    return (
        <AspectRatio ratio={16 / 9} className="group relative">
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-600 transition-all duration-300 group-hover:shadow-lg">
                {thumbnailError ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Avatar className="size-14">
                            <AvatarImage src="/circle-play.svg" />
                            <AvatarFallback />
                        </Avatar>
                    </div>
                ) : (
                    <>
                        {/* Loading skeleton */}
                        {imageLoading && (
                            <div className="absolute inset-0 animate-pulse rounded-lg bg-gray-300" />
                        )}

                        <Image
                            src={thumbnailUrl || ""}
                            alt={alt}
                            fill
                            priority={priority}
                            sizes={sizes}
                            quality={85}
                            placeholder={placeholder}
                            blurDataURL={blurDataURL}
                            className={cn(
                                "rounded-lg object-cover transition-opacity duration-300",
                                imageLoading ? "opacity-0" : "opacity-100",
                            )}
                            onLoad={() => setImageLoading(false)}
                            onError={() => {
                                setThumbnailError(true);
                                setImageLoading(false);
                            }}
                        />
                    </>
                )}
            </div>
        </AspectRatio>
    );
}
