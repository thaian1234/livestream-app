import { Clock, Eye, Heart, LinkIcon } from "lucide-react";
import Link from "next/link";
import ReactPlayer from "react-player";

import { envClient } from "@/lib/env/env.client";

import { VideoDTO } from "@/server/api/dtos/video.dto";

interface VideoPreviewSectionProps {
    video: VideoDTO.Select;
}

export function VideoPreviewSection({ video }: VideoPreviewSectionProps) {
    const videoLink = `${envClient.NEXT_PUBLIC_APP_URL}/video/${video.id}`;
    const formatDuration = () => {
        if (video.duration) {
            const totalSeconds = Math.floor(video.duration / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;

            if (minutes === 0) {
                return `${seconds}s`;
            }

            return minutes === 1
                ? `1 min ${seconds}s`
                : `${minutes} mins ${seconds}s`;
        }
    };

    return (
        <article className="flex size-full flex-col space-y-4 rounded-xl bg-slate-50/10 shadow-sm backdrop-blur-xl">
            {/* TODO: Video Preview Player */}
            <div className="relative aspect-video overflow-hidden rounded-md">
                <ReactPlayer
                    url={video.videoUrl}
                    width="100%"
                    height="100%"
                    playing={false}
                    light={video?.thumbnailUrl ?? ""}
                />
            </div>
            <div className="flex flex-col space-y-3 px-4 pb-4">
                <div>
                    <h3 className="text-base text-white/50">Video link</h3>
                    <div className="flex items-center space-x-2">
                        <LinkIcon className="h-4 w-4 flex-shrink-0" />
                        <Link
                            href={video.videoUrl}
                            className="truncate text-sm font-medium text-blue-500 underline"
                        >
                            {videoLink}
                        </Link>
                    </div>
                </div>
                <div>
                    <h3 className="text-base text-white/50">Video status</h3>
                    <p className="truncate text-sm font-medium first-letter:uppercase">
                        {video.status}
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                            {video.viewCount} views
                        </span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                            {video.likeCount} likes
                        </span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                            {formatDuration()}
                        </span>
                    </div>
                </div>
            </div>
        </article>
    );
}
