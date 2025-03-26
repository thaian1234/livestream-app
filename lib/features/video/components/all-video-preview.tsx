import { Loader2 } from "lucide-react";
import { redirect, useParams } from "next/navigation";

import { timeAgo } from "@/lib/helpers/formatData";

import { VideoThumbnail } from "@/components/thumbnail";

import { videoApi } from "../apis";

export function AllVideoPreview() {
    const { username } = useParams();
    const { data, error, isPending } = videoApi.query.useGetVideosByUsername(
        { page: "1", size: "20" },
        username as string,
    );
    if (!!error) {
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
                    </li>
                ))
            ) : (
                <p>No item</p>
            )}
        </ul>
    );
}