"use client";

import { useState } from "react";

import { Pagination } from "@/components/pagination";

import { streamApi } from "../../apis";
import { LivePreviewCard } from "./live-preview-card";
import { PreviewSkeleton } from "./preview-skeleton";

interface RecommendStreamProps {}

export function RecommendStream({}: RecommendStreamProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const { data, isPending, isError } = streamApi.query.useGetRecommendStreams(
        {
            page: currentPage.toString(),
            size: "8",
        },
    );

    if (isPending) {
        return <PreviewSkeleton />;
    }
    if (!data || isError) {
        return <p>Failed to load stream</p>;
    }

    const { data: streams, pagination } = data.data;
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };
    console.log("streams: ", streams);

    return (
        <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg underline">Recommended Stream</h2>
                <Pagination
                    totalPages={pagination.totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </div>
            <ul className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {!!streams && streams.length > 0 ? (
                    streams.map((stream) => (
                        <li key={stream.id}>
                            <LivePreviewCard {...stream} />
                        </li>
                    ))
                ) : (
                    <p>No streams available</p>
                )}
            </ul>
        </div>
    );
}
