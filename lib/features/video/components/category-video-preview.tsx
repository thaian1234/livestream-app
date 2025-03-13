import { PreviewVideoCarousel } from "./video-preview-carousel";

export interface IVideoPreview {
    id: string;
    userId: string;
    title: string;
    videoUrl: string;
    thumbnailUrl: string | null;
    visibility: "public" | "private" | "followers_only" | "unlisted";
    createdAt: string;
    viewCount: number;
    // comments: number;
    likeCount: number;
    dislikeCount: number;
    duration: number;
}
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

export function CategoryVideoPreview() {
    return (
        <div className="space-y-4 pt-6">
            <p className="text-xl">For you</p>
            <PreviewVideoCarousel videoData={DummyAllVideos} />
            <p className="text-xl">Category 1</p>
            <PreviewVideoCarousel videoData={DummyAllVideos} />
            <p className="text-xl">Category 2</p>
            <PreviewVideoCarousel videoData={DummyAllVideos} />
        </div>
    );
}
