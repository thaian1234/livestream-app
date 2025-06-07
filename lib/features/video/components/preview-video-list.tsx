"use client";

import { redirect, useParams, useRouter } from "next/navigation";

import { ROUTES } from "@/lib/configs/routes.config";
import { formatNumber, formatVideoDuration, timeAgo } from "@/lib/helpers/formatData";

import { VideoThumbnail } from "@/components/thumbnail";

import { videoApi } from "../apis";
import { PreviewVideoListSkeleton } from "./preview-video-list-skeleton";

type ParamsType = {
    videoId: string;
};
export function PreviewVideoList() {
    const params = useParams<ParamsType>();
    const router = useRouter();
    const { data, isPending, error } = videoApi.query.useGetRelateVideo(
        params?.videoId as string,
    );
    const navigateVideoPage = (videoId: string) => {
        router.replace(ROUTES.VIDEO_PAGE(videoId));
    };
    if (!!error || !params?.videoId) {
        redirect("/");
    }

    if (!data || isPending) {
        return <PreviewVideoListSkeleton />;
    }
    return (
        <div className="space-y-4">
            {data.data.map((video, index) => (
                <div
                    key={index}
                    className="flex cursor-pointer gap-2"
                    onClick={() => navigateVideoPage(video.id)}
                >
                    <div className="relative w-48 flex-shrink-0">
                        <VideoThumbnail thumbnailUrl={video.thumbnailUrl} />

                        <div className="absolute bottom-1 right-1 rounded px-1 text-xs">
                            {formatVideoDuration(video.duration || 0)}
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="line-clamp-2 font-medium">
                            {video.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-400">
                            {formatNumber(video.viewCount)} Views
                        </p>
                        <p className="text-sm text-gray-400">
                            {timeAgo(new Date(video.createdAt))}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
