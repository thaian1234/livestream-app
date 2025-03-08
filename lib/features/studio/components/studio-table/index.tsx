"use client";

import { redirect } from "next/navigation";
import { useState } from "react";

import { videoApi } from "@/lib/features/video/apis";

import { DataTablePagination } from "@/components/data-table-pagination";

import { StudioColumns } from "./studio-columns";

export function StudioTable() {
    //phân trang
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    //call api get all video
    const { data, isPending, isError } = videoApi.query.useGetOwnedVideos({
        page: pageNumber.toString(),
        size: pageSize.toString(),
    });
    if (isError) {
        redirect("/");
    }

    if (!data || isPending) {
        return null;
    }
    const videos = data.data.videos;
    return (
        <div className="lg:max-w-[570px] xl:max-w-[830px] 2xl:max-w-full">
            {videos && (
                <DataTablePagination
                    columns={StudioColumns}
                    data={videos}
                    totalPages={
                        Math.ceil(data.data.totalRecords / pageSize) > 0
                            ? Math.ceil(data.data.totalRecords / pageSize)
                            : 1
                    }
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                />
            )}
        </div>
    );
}
