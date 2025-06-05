"use client";

import { LivestreamLayout, StreamVideo } from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useParams } from "next/navigation";

import { useVideoClient } from "@/lib/features/stream/hooks/use-stream-video";
import { CustomCall } from "@/lib/features/stream/layouts/custom-call";

import { Spinner } from "@/components/ui/spinner";

type StreamParams = {
    streamId: string;
};

export default function StreamPage() {
    const params = useParams<StreamParams>();
    const { videoClient, isPending, isError } = useVideoClient();
    if (isPending) {
        return <Spinner size={"large"} />;
    }
    if (isError || !videoClient || !params?.streamId) {
        return <p>Something went wrong</p>;
    }

    return (
        <StreamVideo client={videoClient}>
            <CustomCall streamId={params.streamId}>
                <div className="container aspect-video border-2 border-white">
                    <LivestreamLayout />
                </div>
            </CustomCall>
        </StreamVideo>
    );
}
