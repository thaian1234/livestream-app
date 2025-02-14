import { Eye, Heart, LinkIcon } from "lucide-react";
import Link from "next/link";
import ReactPlayer from "react-player";

export function VideoPreviewSection() {
    return (
        <article className="flex size-full flex-col space-y-4 rounded-xl bg-slate-50/10 shadow-sm backdrop-blur-xl">
            {/* TODO: Video Preview Player */}
            <div className="relative aspect-video overflow-hidden rounded-md">
                <ReactPlayer
                    url="https://www.youtube.com/watch?v=LXb3EKWsInQ"
                    width="100%"
                    height="100%"
                />
            </div>
            <div className="flex flex-col space-y-3 px-4 pb-6">
                <div>
                    <h3 className="text-base text-white/50">Video link</h3>
                    <div className="flex items-center space-x-2">
                        <LinkIcon className="h-4 w-4 flex-shrink-0" />
                        <Link
                            href={"https://youtu.be/dQw4w9WgXcQ"}
                            className="truncate text-sm font-medium text-blue-500 underline"
                        >
                            https://youtu.be/dQw4w9WgXcQ
                        </Link>
                    </div>
                </div>
                <div>
                    <h3 className="text-base text-white/50">Video Status</h3>
                    <p className="truncate text-sm font-medium">Ready</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                            1,234,567 views
                        </span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">98.7K likes</span>
                    </div>
                </div>
            </div>
        </article>
    );
}
