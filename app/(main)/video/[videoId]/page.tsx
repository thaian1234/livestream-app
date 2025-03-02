import { PreviewVideoList } from "@/lib/features/video/components/preview-video-list";
import { VideoPlayer } from "@/lib/features/video/components/video-player";
import { DummyVideoPlayer } from "@/lib/features/video/components/video-player/dummy-video-player";
import { VideoInfor } from "@/lib/features/video/components/video-player/video-infor";

export default function VideoPage() {
    return (
        <div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <VideoPlayer />
                    {/* <DummyVideoPlayer /> */}
                </div>
                <PreviewVideoList />
            </div>
        </div>
    );
}
