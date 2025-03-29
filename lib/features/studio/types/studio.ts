export interface IVideoStudio {
    id: string;
    userId: string;
    title: string;
    videoUrl: string;
    thumbnailUrl: string | null;
    visibility: "public" | "private" | "followers_only" | "unlisted";
    createdAt: string;
    viewCount: number;
    likeCount?: number | null;
    dislikeCount?: number | null;
}
