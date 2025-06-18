"use client";

import { useParams, useRouter } from "next/navigation";

import { videoApi } from "@/lib/features/video/apis";
import { EditVideoForm } from "@/lib/features/video/components/edit-video-form";

import { Spinner } from "@/components/ui/spinner";

export default function VideoEditPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const { data, isPending, error } = videoApi.query.useGetVideo(
        params?.id || "",
    );

    if (!data || isPending) {
        return <Spinner size="large" />;
    }

    if (error || !params) {
        return router.replace("/");
    }

    return <EditVideoForm videoId={params.id} defaultVideo={data.data} />;
}
