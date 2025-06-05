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

function generateBlurDataURL(width: number = 16, height: number = 9): string {
    if (typeof window === "undefined") {
        return "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAJAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rq5TcjaMEux9ixcPLvXaOPaA=";
    }

    try {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (ctx) {
            // Create gradient background
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, "#374151"); // gray-700
            gradient.addColorStop(0.5, "#4B5563"); // gray-600
            gradient.addColorStop(1, "#374151"); // gray-700

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            return canvas.toDataURL("image/jpeg", 0.1);
        }
    } catch (error) {
        console.warn("Failed to generate canvas blur data URL:", error);
    }

    // Fallback blur data URL
    return "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAJAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rq5TcjaMEux9ixcPLvXaOPaA=";
}

export function VideoThumbnail({
    thumbnailUrl,
    priority = false,
    sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    alt = "Video thumbnail",
    placeholder = "blur",
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
                            blurDataURL={generateBlurDataURL()}
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
