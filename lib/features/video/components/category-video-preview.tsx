import { Loader2 } from "lucide-react";
import { redirect, useParams } from "next/navigation";

import { videoApi } from "../apis";
import { PreviewVideoCarousel } from "./video-preview-carousel";

export function CategoryVideoPreview() {
    const params = useParams<{ username: string }>();
    const { data, error, isPending } =
        videoApi.query.useGetVideoProfilesByUsername(
            params?.username as string,
        );
    const {
        data: dataForYou,
        error: errorForYou,
        isPending: isPendingforYou,
    } = videoApi.query.useGetVideosByUsername(
        { page: "1", size: "4" },
        params?.username as string,
    );

    if (!!error || !params?.username || !!errorForYou) {
        redirect("/");
    }

    if (!data || isPending || !dataForYou || isPendingforYou) {
        return <Loader2 />;
    }
    const videos = data.data.videos;
    const videosForYou = dataForYou.data.videos;
    return (
        <div className="space-y-4 pt-6">
            <p className="text-xl">For you</p>
            <PreviewVideoCarousel videoData={videosForYou} />
            {videos.length > 0 &&
                videos.map((video, index) => (
                    <>
                        <p className="text-xl">{video.category}</p>
                        <PreviewVideoCarousel videoData={video.video} />
                    </>
                ))}
        </div>
    );
}
