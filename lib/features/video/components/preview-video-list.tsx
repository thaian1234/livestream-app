"use client";

import { redirect, useParams, useRouter } from "next/navigation";

import { ROUTES } from "@/lib/configs/routes.config";
import { formatNumber, timeAgo } from "@/lib/helpers/formatData";

import { VideoThumbnail } from "@/components/thumbnail";

import { videoApi } from "../apis";
import { PreviewVideoListSkeleton } from "./preview-video-list-skeleton";

const recommendedVideos = [
    {
        title: "slow days, soft sounds — (music playlist for moments of peace)",
        views: "142K views",
        timeAgo: "4 months ago",
        duration: "31:19",
        thumbnail:
            "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pinterest.com%2Fathuan611%2F%25E1%25BA%25A3nh-169%2F&psig=AOvVaw3n1uhLO7LOMaGooIgZLHx9&ust=1740549122864000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCIiBzfKQ3osDFQAAAAAdAAAAABAE",
    },
    {
        title: "peaceful and inspiring music for painting, reading or relaxing",
        views: "451K views",
        timeAgo: "5 months ago",
        duration: "1:17:28",
        thumbnail:
            "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pinterest.com%2Fathuan611%2F%25E1%25BA%25A3nh-169%2F&psig=AOvVaw3n1uhLO7LOMaGooIgZLHx9&ust=1740549122864000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCIiBzfKQ3osDFQAAAAAdAAAAABAE",
    },
    {
        title: "peace comes from within, do not seek it without — (a playlist)",
        views: "270K views",
        timeAgo: "4 months ago",
        duration: "31:12",
        thumbnail:
            "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pinterest.com%2Fathuan611%2F%25E1%25BA%25A3nh-169%2F&psig=AOvVaw3n1uhLO7LOMaGooIgZLHx9&ust=1740549122864000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCIiBzfKQ3osDFQAAAAAdAAAAABAE",
    },
];
type ParamsType = {
    videoId: string;
};
export function PreviewVideoList() {
    const { videoId } = useParams<ParamsType>();
    const router = useRouter();
    const { data, isPending, error } =
        videoApi.query.useGetRelateVideo(videoId);
    const navigateVideoPage = (videoId: string) => {
        router.replace(ROUTES.VIDEO_PAGE(videoId));
    };
    if (!!error) {
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
                            {video.duration}
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
