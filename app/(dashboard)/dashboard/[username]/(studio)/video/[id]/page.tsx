"use client";

import { redirect, useParams } from "next/navigation";

import { videoApi } from "@/lib/features/video/apis";
import { EditVideoForm } from "@/lib/features/video/components/edit-video-form";

export default function VideoEditPage() {
    const { id } = useParams<{
        id: string;
    }>();

    if (!id) {
        redirect("/");
    }
    const { data, isPending } = videoApi.query.useGetVideo(id);

    if (!data || isPending) {
        return null;
    }

    return <EditVideoForm videoId={id} defaultVideo={data.data} />;
}
