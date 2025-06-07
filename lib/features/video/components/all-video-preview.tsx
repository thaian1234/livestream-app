import { Loader2 } from "lucide-react";
import { redirect, useParams } from "next/navigation";

import { formatVideoDuration, timeAgo } from "@/lib/helpers/formatData";

import { VideoThumbnail } from "@/components/thumbnail";

import { videoApi } from "../apis";

export function AllVideoPreview() {
    const params = useParams<{ username: string }>();
    const { data, error, isPending } = videoApi.query.useGetVideosByUsername(
        { page: "1", size: "20" },
        params?.username as string,
    );

    if (!!error || !params?.username) {
        redirect("/");
    }

    if (!data || isPending) {
        return <Loader2 />;
    }

    const videos = data.data.videos;

    return (
        <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {videos && videos.length > 0 ? (
                videos.map((video) => (
                    <li key={video.id}>
                        <div
                            className="flex cursor-pointer flex-col gap-2"
                            // onClick={() => navigateVideoPage(video.id)}
                        >
                            <div className="relative flex-shrink-0">
                                <VideoThumbnail
                                    thumbnailUrl={video.thumbnailUrl}
                                />

                                <div className="absolute bottom-1 right-1 rounded px-1 text-xs">
                                    {formatVideoDuration(video.duration || 0)}
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
                    </li>
                ))
            ) : (
                <p className="text-center text-base text-gray-400">No item</p>
            )}
        </ul>
    );
}
