"use client";

import { redirect, useParams } from "next/navigation";

import { videoApi } from "@/lib/features/video/apis";
import { EditVideoForm } from "@/lib/features/video/components/edit-video-form";

export default function VideoEditPage() {
    const params = useParams<{ id: string }>();
    const { data, isPending, error } = videoApi.query.useGetVideo(
        params?.id || "",
    );

    if (!!error || !params) {
        redirect("/");
    }

    if (!data || isPending) {
        return null;
    }

    return (
        <>
            <EditVideoForm videoId={params.id} defaultVideo={data.data} />
        </>
    );
}
