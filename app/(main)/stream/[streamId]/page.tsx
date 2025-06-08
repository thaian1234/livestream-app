"use client";

import { LivestreamLayout, StreamVideo } from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useParams } from "next/navigation";

import { CustomCall } from "@/lib/features/stream/layouts/custom-call";
import { useStreamVideoContext } from "@/lib/providers/stream-video-context-provider";

import { Spinner } from "@/components/ui/spinner";

type StreamParams = {
    streamId: string;
};

export default function StreamPage() {
    const params = useParams<StreamParams>();

    if (!params?.streamId) {
        return <p>Something went wrong</p>;
    }

    return (
        <CustomCall streamId={params.streamId}>
            <div className="container aspect-video border-2 border-white">
                <LivestreamLayout />
            </div>
        </CustomCall>
    );
}
