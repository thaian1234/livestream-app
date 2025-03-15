import { timeAgo } from "@/lib/helpers/formatData";

import { VideoThumbnail } from "@/components/thumbnail";

import { IVideoPreview } from "./category-video-preview";

const DummyAllVideos: IVideoPreview[] = [
    {
        id: "1",
        userId: "user_123",
        title: "Introduction to TypeScript",
        videoUrl: "https://youtu.be/YX3W6YFKY94",
        thumbnailUrl: null,
        visibility: "public",
        createdAt: new Date().toISOString(),
        viewCount: 1200,
        likeCount: 150,
        dislikeCount: 10,
        duration: 600, // 10 phút
    },
    {
        id: "2",
        userId: "user_456",
        title: "Advanced React Hooks",
        videoUrl: "https://youtu.be/YX3W6YFKY94",
        thumbnailUrl: null,
        visibility: "private",
        createdAt: new Date().toISOString(),
        viewCount: 800,
        likeCount: 90,
        dislikeCount: 5,
        duration: 900, // 15 phút
    },
    {
        id: "3",
        userId: "user_789",
        title: "Next.js Server Actions Guide",
        videoUrl: "https://youtu.be/YX3W6YFKY94",
        thumbnailUrl: null,
        visibility: "public",
        createdAt: new Date().toISOString(),
        viewCount: 1500,
        likeCount: 200,
        dislikeCount: 15,
        duration: 1200, // 20 phút
    },
    {
        id: "4",
        userId: "user_101",
        title: "Deploying Full Stack Apps with Vercel",
        videoUrl: "https://youtu.be/YX3W6YFKY94",
        thumbnailUrl: null,
        visibility: "unlisted",
        createdAt: new Date().toISOString(),
        viewCount: 450,
        likeCount: 40,
        dislikeCount: 2,
        duration: 750, // 12.5 phút
    },
    {
        id: "5",
        userId: "user_202",
        title: "Understanding Zustand for State Management",
        videoUrl: "https://youtu.be/YX3W6YFKY94",
        thumbnailUrl: null,
        visibility: "followers_only",
        createdAt: new Date().toISOString(),
        viewCount: 300,
        likeCount: 25,
        dislikeCount: 1,
        duration: 540, // 9 phút
    },
    {
        id: "5",
        userId: "user_202",
        title: "Understanding Zustand for State Management",
        videoUrl: "https://youtu.be/YX3W6YFKY94",
        thumbnailUrl: null,
        visibility: "followers_only",
        createdAt: new Date().toISOString(),
        viewCount: 300,
        likeCount: 25,
        dislikeCount: 1,
        duration: 540, // 9 phút
    },
];
export function AllVideoPreview() {
    return (
        <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {DummyAllVideos && DummyAllVideos.length > 0 ? (
                DummyAllVideos.map((video) => (
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
