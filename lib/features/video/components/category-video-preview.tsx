import { Loader2 } from "lucide-react";
import { redirect, useParams } from "next/navigation";

import { videoApi } from "../apis";
import { PreviewVideoCarousel } from "./video-preview-carousel";

export function CategoryVideoPreview() {
    const { username } = useParams();
    const { data, error, isPending } = videoApi.query.useGetVideosByUsername(
        { page: "1", size: "5" },
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
        <div className="space-y-4 pt-6">
            <p className="text-xl">For you</p>
            <PreviewVideoCarousel videoData={videos} />
            <p className="text-xl">Category 1</p>
            <PreviewVideoCarousel videoData={videos} />
            <p className="text-xl">Category 2</p>
            <PreviewVideoCarousel videoData={videos} />
        </div>
    );
}
