"use client";

import { useRouter } from "next/navigation";

import { ROUTES } from "@/lib/configs/routes.config";
import { timeAgo } from "@/lib/helpers/formatData";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

import { VideoThumbnail } from "@/components/thumbnail";

import { IVideoPreview } from "./category-video-preview";

interface PreviewVideoCarouselProps {
    videoData: IVideoPreview[];
}
export function PreviewVideoCarousel({ videoData }: PreviewVideoCarouselProps) {
    const router = useRouter();
    const navigateVideoPage = (videoId: string) => {
        router.push(ROUTES.VIDEO_PAGE(videoId));
    };

    return (
        <div className="">
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="mx-14"
            >
                <CarouselContent className="w-full">
                    {videoData?.map((video, index) => (
                        <CarouselItem
                            key={index}
                            className="sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5"
                        >
                            <div
                                key={index}
                                className="flex cursor-pointer flex-col gap-2"
                                onClick={() => navigateVideoPage(video.id)}
                            >
                                <div className="relative flex-shrink-0">
                                    <VideoThumbnail
                                        thumbnailUrl={video.thumbnailUrl}
                                    />

                                    <div className="absolute bottom-1 right-1 rounded px-1 text-xs">
                                        {video.duration}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="line-clamp-2 font-medium">
                                        {video.title}
                                    </h3>
                                    <p className="mt-1 text-xs text-gray-400">
                                        {video.viewCount} Views
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {timeAgo(new Date(video.createdAt))}
                                    </p>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
}
