"use client";

import { StreamTheme } from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";

import { streamApi } from "@/lib/features/stream/apis";
import { CustomCall } from "@/lib/features/stream/layouts/custom-call";
import { StreamVideoProvider } from "@/lib/providers/stream-video-provider";

type StreamParams = {
    params: {
        username: string;
    };
    children: React.ReactNode;
};

export default function StreamLayout({
    children,
    params,
}: Readonly<StreamParams>) {
    const { data, isPending, isError } =
        streamApi.query.useGetStreamInformation(params.username);
    if (isPending) {
        return <p>Loading...</p>;
    }
    if (!data || isError) {
        return <p>(Layout): Cannot load stream</p>;
    }

    return (
        <StreamTheme as="section">
            <StreamVideoProvider>
                <CustomCall streamId={data.data.stream.id}>
                    {children}
                </CustomCall>
            </StreamVideoProvider>
        </StreamTheme>
    );
}
