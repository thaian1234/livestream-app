"use client";

import { redirect } from "next/navigation";
import { useState } from "react";

import { videoApi } from "@/lib/features/video/apis";

import { DataTablePagination } from "@/components/data-table-pagination";

import { IVideo, StudioColumns } from "./studio-columns";

// const dummyDataVideos: IVideo[] = [
//     {
//         id: "1",
//         title: "Introduction to React",
//         thumbnailUrl: "/placeholder.svg?height=120&width=200",
//         videoUrl: "http://localhost:3000/",
//         visibility: "public",
//         createdAt: "15/05/2024",
//         viewCount: 150000000,
//         likeCount: 1200,
//         dislikeCount: 50,
//     },
//     {
//         id: "2",
//         title: "Advanced CSS Techniques Advan     CSS Techniques Advanced CSS Techniques Advanced CSS Techniques Advanced CSS Techniques",
//         thumbnailUrl: "/placeholder.svg?height=120&width=200",
//         videoUrl: "https://example.com/video2",
//         visibility: "unlisted",
//         createdAt: "02/06/2023",
//         viewCount: 8500,
//         likeCount: 950,
//         dislikeCount: 30,
//     },
//     {
//         id: "",
//         title: "JavaScript ES6 Features",
//         thumbnailUrl: "/placeholder.svg?height=120&width=200",
//         videoUrl: "https://example.com/video3",
//         visibility: "followers_only",
//         createdAt: "20/06/2023",
//         viewCount: 12000,
//         likeCount: 1100,
//         dislikeCount: 40,
//     },
//     {
//         id: "",
//         title: "JavaScript ES6 Features",
//         thumbnailUrl: "/placeholder.svg?height=120&width=200",
//         videoUrl: "https://example.com/video3",
//         visibility: "private",
//         createdAt: "20/06/2023",
//         viewCount: 12000,
//         likeCount: 1100,
//         dislikeCount: 40,
//     },
//     {
//         id: "",
//         title: "JavaScript ES6 Features",
//         thumbnailUrl: "/placeholder.svg?height=120&width=200",
//         videoUrl: "https://example.com/video3",
//         visibility: "private",
//         createdAt: "20/06/2023",
//         viewCount: 12000,
//         likeCount: 1100,
//         dislikeCount: 40,
//     },
//     {
//         id: "",
//         title: "JavaScript ES6 Features",
//         thumbnailUrl: "/placeholder.svg?height=120&width=200",
//         videoUrl: "https://example.com/video3",
//         visibility: "private",
//         createdAt: "20/06/2023",
//         viewCount: 12000,
//         likeCount: 1100,
//         dislikeCount: 40,
//     },
// ];
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
        <div className="lg:max-w-[570px] xl:max-w-[830px] 2xl:max-w-full">
            {videos && (
                <DataTablePagination
                    columns={StudioColumns}
                    data={videos}
                    totalPages={
                        Math.ceil(videos.length / pageSize) > 0
                            ? Math.ceil(videos.length / pageSize)
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
