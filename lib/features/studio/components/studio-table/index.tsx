"use client";

import { redirect } from "next/navigation";
import { useState } from "react";

import { useVideoClient } from "@/lib/features/stream/hooks/use-stream-video";
import { videoApi } from "@/lib/features/video/apis";

import { DataTablePagination } from "@/components/data-table-pagination";

import { IVideo, StudioColumns } from "./studio-columns";

export function StudioTable() {
    //phân trang
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    //call api get all video
    const { data, isPending, isError } = videoApi.query.useGetVideos();
    if (isError) {
        redirect("/");
    }

    if (!data || isPending) {
        return null;
    }
    const videos = data.data;
    return (
        <>
            {videos && (
                <DataTablePagination
                    columns={StudioColumns}
                    data={videos}
                    totalPages={videos.length} //lấy từ api
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                />
            )}
        </>
    );
}
