"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { videoApi } from "@/lib/features/video/apis";
import { EditVideoForm } from "@/lib/features/video/components/edit-video-form";

import { Spinner } from "@/components/ui/spinner";

export default function VideoEditPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const { data, isPending, error } = videoApi.query.useGetVideo(
        params?.id || "",
    );

    useEffect(() => {
        if (error || !params?.id) {
            router.replace("/");
        }
    }, [error, params?.id, router]);

    if (!data || isPending) {
        return <Spinner size="large" />;
    }

    if (error || !params?.id) {
        return null;
    }

    return <EditVideoForm videoId={params.id} defaultVideo={data.data} />;
}
