"use client";

import { VideoThumbnail } from "@/components/thumbnail";

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
export function PreviewVideoList() {
    const navigateVideoPage = () => {
        // Navigate to video page
    };
    return (
        <div className="space-y-4">
            {recommendedVideos.map((video, index) => (
                <div
                    key={index}
                    className="flex cursor-pointer gap-2"
                    onClick={navigateVideoPage}
                >
                    <div className="relative w-48 flex-shrink-0">
                        <VideoThumbnail
                            thumbnailUrl={video.thumbnail}
                            avatarUrl={video.thumbnail}
                        />

                        <div className="bg-black/80 absolute bottom-1 right-1 rounded px-1 text-xs">
                            {video.duration}
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="line-clamp-2 font-medium">
                            {video.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-400">
                            {video.views}
                        </p>
                        <p className="text-sm text-gray-400">{video.timeAgo}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
