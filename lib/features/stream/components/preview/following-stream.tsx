"use client";

import { streamApi } from "../../apis";
import { useState } from "react";

import { Pagination } from "@/components/pagination";

import { LivePreviewCard } from "./live-preview-card";
import { PreviewSkeleton } from "./preview-skeleton";

interface FollowingStreamProps {}

export function FollowingStream({}: FollowingStreamProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const { data, isPending, isError } = streamApi.query.useGetFollowingStreams(
        {
            page: currentPage.toString(),
            size: "4",
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

    return (
        <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg underline">Following Streams</h2>
                <Pagination
                    totalPages={pagination.totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </div>
            <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {streams && streams.length > 0 ? (
                    streams.map((stream) => (
                        <li key={stream.id}>
                            <LivePreviewCard {...stream} />
                        </li>
                    ))
                ) : (
                    <p>No following stream</p>
                )}
            </ul>
        </div>
    );
}
